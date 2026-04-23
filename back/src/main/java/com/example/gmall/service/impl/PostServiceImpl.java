package com.example.gmall.service.impl;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gmall.domain.Answer;
import com.example.gmall.domain.Board;
import com.example.gmall.domain.Member;
import com.example.gmall.domain.Post;
import com.example.gmall.dto.board.PageResponseDTO;
import com.example.gmall.dto.board.PostDetailResponseDTO;
import com.example.gmall.dto.board.PostListResponseDTO;
import com.example.gmall.dto.board.PostRegisterRequestDTO;
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

    private static final int BOARD_NOTICE = 1;
    private static final int BOARD_QNA = 2;

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    /**
     * 현재 로그인한 회원의 memberId를 반환
     * JWTCheckFilter에서 principal을 Long(memberId)으로 설정하므로 이를 그대로 사용
     */
    private Long getCurrentMemberId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AccessDeniedException("로그인이 필요합니다.");
        }
        return ((Number) authentication.getPrincipal()).longValue();
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            return false;
        }
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    @Override
    public Long register(PostRegisterRequestDTO dto) {
        Long memberId = getCurrentMemberId();
        log.info("게시글 등록 프로세스 시작: {}, 작성자ID: {}", dto.getTitle(), memberId);

        Member member = memberRepository.findByIdAndIsDeletedFalse(memberId)
                .orElseThrow(() -> new NoSuchElementException(
                    "활성화된 사용자 정보를 찾을 수 없습니다. ID: " + memberId));

        Board board = boardRepository.findById(dto.getBoardId())
                .orElseThrow(() -> new NoSuchElementException(
                    "해당 게시판을 찾을 수 없습니다. ID: " + dto.getBoardId()));

        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .isPublic(dto.isPublic())
                .member(member)
                .board(board)
                .viewCount(0)
                .isDeleted(false)
                .build();

        board.addPost(post);
        log.info("게시글 저장 완료 - 작성자: {}", member.getMname());

        return postRepository.save(post).getPostId();
    }

    @Override
    @Transactional
    public PostDetailResponseDTO getPost(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("해당 게시글을 찾을 수 없습니다."));

        if (post.isDeleted()) {
            throw new NoSuchElementException("삭제된 게시글입니다.");
        }

        Integer boardId = post.getBoard().getBoardId();

        // [사이트] 비공개 공지사항 → 모두 차단 (관리자도 어드민 페이지에서만 조회 가능)
        if (boardId == BOARD_NOTICE && !post.isPublic()) {
            throw new AccessDeniedException("비공개 공지사항입니다.");
        }

        // [사이트] 비공개 고객문의 → 작성자 본인만 조회 가능 (관리자도 어드민 페이지에서만 조회 가능)
        if (boardId == BOARD_QNA && !post.isPublic()) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || "anonymousUser".equals(auth.getPrincipal())) {
                throw new AccessDeniedException("비공개 게시물은 작성자 본인만 확인할 수 있습니다.");
            }
            Long currentMemberId = ((Number) auth.getPrincipal()).longValue();
            boolean isOwner = post.getMember().getId().equals(currentMemberId);

            if (!isOwner) {
                throw new AccessDeniedException("비공개 게시물은 작성자 본인만 확인할 수 있습니다.");
            }
        }

        post.incrementViewCount();
        return PostDetailResponseDTO.from(post);
    }

    @Override
    public void addAnswer(Long id, String answerContent) {
        if (!isAdmin()) {
            throw new AccessDeniedException("관리자만 답변을 등록할 수 있습니다.");
        }

        Long adminMemberId = getCurrentMemberId();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("답변할 게시글이 없습니다."));

        Member admin = memberRepository.findById(adminMemberId)
                .orElseThrow(() -> new NoSuchElementException("관리자 정보를 찾을 수 없습니다."));

        Answer answer = Answer.builder()
                .content(answerContent)
                .member(admin)
                .build();

        post.addAnswer(answer);
    }

    @Override
    public void remove(Long id) {
        Long currentMemberId = getCurrentMemberId();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("삭제할 게시글이 없습니다."));

        boolean isOwner = post.getMember().getId().equals(currentMemberId);
        if (!isOwner && !isAdmin()) {
            throw new AccessDeniedException("본인이 작성한 게시글이거나 관리자만 삭제할 수 있습니다.");
        }

        post.changeDeleteStatus(true);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<PostListResponseDTO> getInquiryList(String keyword, Boolean hasAnswer, Boolean isPublic, Pageable pageable) {
        Page<PostListResponseDTO> result = postRepository.getPostList(BOARD_QNA, keyword, hasAnswer, isPublic, pageable);

        return PageResponseDTO.<PostListResponseDTO>withAll()
                .dtoList(result.getContent())
                .totalCount(result.getTotalElements())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<PostListResponseDTO> getBoardList(String keyword, Pageable pageable) {
        // [사이트] 공지사항 목록: 공개글만 조회 (비공개는 어드민 페이지에서만 조회)
        Page<PostListResponseDTO> result = postRepository.getPostList(
                BOARD_NOTICE, keyword, null, Boolean.TRUE, pageable);

        return PageResponseDTO.<PostListResponseDTO>withAll()
                .dtoList(result.getContent())
                .totalCount(result.getTotalElements())
                .build();
    }

    // ========== [관리자 전용] 공개/비공개 모두 조회 ==========

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<PostListResponseDTO> getBoardListForAdmin(String keyword, Pageable pageable) {
        if (!isAdmin()) {
            throw new AccessDeniedException("관리자만 접근할 수 있습니다.");
        }
        // 비공개 포함 전체 조회
        Page<PostListResponseDTO> result = postRepository.getPostList(
                BOARD_NOTICE, keyword, null, null, pageable);

        return PageResponseDTO.<PostListResponseDTO>withAll()
                .dtoList(result.getContent())
                .totalCount(result.getTotalElements())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDTO<PostListResponseDTO> getInquiryListForAdmin(String keyword, Boolean hasAnswer, Boolean isPublic, Pageable pageable) {
        if (!isAdmin()) {
            throw new AccessDeniedException("관리자만 접근할 수 있습니다.");
        }
        // 필터 조건(hasAnswer, isPublic)을 그대로 적용
        Page<PostListResponseDTO> result = postRepository.getPostList(
                BOARD_QNA, keyword, hasAnswer, isPublic, pageable);

        return PageResponseDTO.<PostListResponseDTO>withAll()
                .dtoList(result.getContent())
                .totalCount(result.getTotalElements())
                .build();
    }

    @Override
    @Transactional
    public PostDetailResponseDTO getPostForAdmin(Long id) {
        if (!isAdmin()) {
            throw new AccessDeniedException("관리자만 접근할 수 있습니다.");
        }
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("해당 게시글을 찾을 수 없습니다."));

        if (post.isDeleted()) {
            throw new NoSuchElementException("삭제된 게시글입니다.");
        }

        // 관리자는 비공개 여부와 상관없이 모두 조회 가능
        post.incrementViewCount();
        return PostDetailResponseDTO.from(post);
    }

    @Override
    public void updatePost(Long id, PostRegisterRequestDTO dto) {
        Long currentMemberId = getCurrentMemberId();

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("수정할 게시글을 찾을 수 없습니다."));

        if (!post.getMember().getId().equals(currentMemberId) && !isAdmin()) {
            throw new AccessDeniedException("본인이 작성한 게시글만 수정할 수 있습니다.");
        }

        post.updatePost(dto.getTitle(), dto.getContent(), dto.isPublic());
    }
}