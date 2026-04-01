package com.example.gmall.service.impl;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gmall.domain.Answer;
import com.example.gmall.domain.Board;
import com.example.gmall.domain.Member;
import com.example.gmall.domain.Post;
import com.example.gmall.dto.board.PostDetailResponseDTO;
import com.example.gmall.dto.board.PostListResponseDTO;
import com.example.gmall.repository.BoardRepository;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.PostRepository;
import com.example.gmall.service.PostService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;



@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;


    //[사용자] 게시글 등록
    @Override
    public Long register(PostDetailResponseDTO dto) {
        log.info("게시글 등록 프로세스 시작: " + dto.getTitle());

        // [핵심] 1. 현재 로그인한 사용자의 Principal 추출
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        }

        Object principal = authentication.getPrincipal();
        String loginId;
        
        if (principal instanceof UserDetails) {
            loginId = ((UserDetails)principal).getUsername();
        } else {
            loginId = principal.toString();
        }

        // 2. 실제 DB에서 회원 엔티티 조회 
        Member member = memberRepository.findByLoginIdAndIsDeletedFalse(loginId)
                .orElseThrow(() -> new NoSuchElementException("활성화된 사용자 정보를 찾을 수 없습니다. ID: " + loginId));

        // 3. 게시판 엔티티 조회 (프론트에서 넘겨준 boardId 활용)
        Board board = boardRepository.findById(dto.getBoardId())
                .orElseThrow(() -> new NoSuchElementException("해당 게시판을 찾을 수 없습니다. ID: " + dto.getBoardId()));

        // 4. Post 엔티티 빌드 (작성자와 게시판을 생성 시점에 주입)
        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .isPublic(dto.isPublic())
                .member(member) // 작성자 연동 (익명 탈출의 핵심)
                .board(board)   // 게시판 연동
                .viewCount(0)
                .isDeleted(false)
                .build();

        // 5. 연관관계 편의 메서드 실행 및 저장
        board.addPost(post); 
        log.info("게시글 저장 완료 - 작성자: " + member.getMname());

        return postRepository.save(post).getPostId();
    }
    

  
    //[사용자/관리자] 게시글 상세 조회 (조회수 증가 포함)
    @Override
    @Transactional
    public PostDetailResponseDTO getPost(Long id) {
        // 1. 게시글 존재 여부 확인
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("해당 게시글을 찾을 수 없습니다."));

        // 2. 게시판 ID 추출 (Integer 타입 유지)
        Integer boardId = post.getBoard().getBoardId(); 

        // 3. [공지사항 - ID: 1] 로직: 누구나 조회 가능 및 조회수 증가
        if (boardId == 1) { 
            post.incrementViewCount(); 
            return new PostDetailResponseDTO(post);
        }

        // 4. [고객문의 - ID: 2] 로직: 보안 및 권한 체크
        if (boardId == 2) {
            // 현재 세션의 사용자 아이디(loginId) 가져오기
            String currentLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
            
            //작성자 본인 여부 확인 (loginId 기준 비교)
            boolean isOwner = post.getMember().getLoginId().equals(currentLoginId);
            
            //관리자 권한(ROLE_ADMIN) 확인
            boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                              .stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            //작성자가 현재 탈퇴하지 않은 상태인지 확인 (선택 사항이지만 안전함)
            boolean isMemberActive = !post.getMember().isDeleted();

            // 권한 체크: 본인이면서 활성 상태이거나, 혹은 관리자일 때만 허용
            if ((isOwner && isMemberActive) || isAdmin) {
                // 고객문의는 조회수를 노출하지 않는 기획에 맞춰 incrementViewCount()를 호출하지 않습니다.
                return new PostDetailResponseDTO(post);
            } else {
                // 권한이 없는 사용자가 접근 시 스프링 시큐리티 예외 발생
                throw new AccessDeniedException("해당 게시물을 볼 권한이 없습니다.");
            }
        }

        // 5. 그 외 게시판 타입일 경우 기본 반환
        return new PostDetailResponseDTO(post);
    }
    

    
 
     //[관리자] 답변 등록
    @Override
    public void addAnswer(Long id, String answerContent) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("답변할 게시글이 없습니다."));

        // 관리자 정보 조회 (실제 운영 시에는 세션에서 관리자 권한 확인 후 ID 추출)
        Member admin = memberRepository.findById(1L) 
                .orElseThrow(() -> new NoSuchElementException("관리자 정보를 찾을 수 없습니다."));

        Answer answer = Answer.builder()
                .content(answerContent)
                .member(admin)
                .build();

        post.addAnswer(answer); 
    }

    
     //[관리자/사용자] 게시글 삭제 (소프트 삭제)
    @Override
    public void remove(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("삭제할 게시글이 없습니다."));

        post.changeDeleteStatus(true);
    }

   
    //[사용자] 고객문의 목록 조회
    @Override
    @Transactional(readOnly = true)
    public Page<PostListResponseDTO> getInquiryList(Pageable pageable) {
        Board board = boardRepository.findById(2) 
                .orElseThrow(() -> new NoSuchElementException("고객문의 게시판을 찾을 수 없습니다."));

        return postRepository.findByBoardAndIsDeletedFalseOrderByPostIdDesc(board, pageable)
                .map(PostListResponseDTO::new);
    }

    
     //[사용자] 공지사항 목록 조회
    @Override
    @Transactional(readOnly = true)
    public Page<PostListResponseDTO> getNoticeList(Pageable pageable) {
        Board board = boardRepository.findById(1) 
                .orElseThrow(() -> new NoSuchElementException("공지사항 게시판을 찾을 수 없습니다."));

        return postRepository.findByBoardAndIsDeletedFalseOrderByPostIdDesc(board, pageable)
                .map(PostListResponseDTO::new);
    }
}