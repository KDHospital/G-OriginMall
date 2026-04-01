package com.example.gmall.service.impl;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // 1. [사용자] 게시글 등록 (보드와 멤버 연관관계 필수)
    @Override
    public Long register(PostDetailResponseDTO dto) {
        log.info("Registering inquiry: " + dto.getTitle());

        // 기획상 게시판(Board)과 작성자(Member)가 먼저 DB에 있어야 함
        Board board = boardRepository.findById(dto.getBoardId())
                .orElseThrow(() -> new NoSuchElementException("게시판을 찾을 수 없습니다."));
        Member member = memberRepository.findById(1L) // 멤버 ID는 세션 등에서 가져옴
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다."));

        // 빌더를 통해 Post 생성 (is_deleted 등 기본값은 엔티티 설정 따름)
        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .isPublic(dto.isPublic())
                .build();

        // [중요] 우리가 만든 연관관계 편의 메서드 사용
        board.addPost(post); 
        post.updateMember(member); // Post 엔티티에 updateMember 메서드 추가 필요

        return postRepository.save(post).getPostId();
    }

    // 2. [사용자/관리자] 게시글 상세 조회 (조회수 증가 포함)
    @Override
    public PostDetailResponseDTO getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("해당 게시글이 없습니다. ID: " + id));

        // [중요] 비즈니스 메서드로 조회수 증가
        post.incrementViewCount(); 
        
        return new PostDetailResponseDTO(post); // 생성자 방식 DTO 변환
    }

    // 3. [관리자] 답변 등록
    @Override
    public void addAnswer(Long id, String answerContent) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("답변할 게시글이 없습니다."));

        // 답변자(관리자) 정보 조회
        Member admin = memberRepository.findById(1L) // 실제론 로그인한 관리자 ID
                .orElseThrow(() -> new NoSuchElementException("관리자 정보를 찾을 수 없습니다."));

        // Answer 엔티티 생성 (No Setter)
        Answer answer = Answer.builder()
                .content(answerContent)
                .member(admin)
                .build();

        // [중요] Post 엔티티의 비즈니스 메서드로 답변 추가
        post.addAnswer(answer); 
    }

    // 4. [관리자] 게시글 삭제 (소프트 삭제)
    @Override
    public void remove(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("삭제할 게시글이 없습니다."));

        // 진짜 삭제 대신 상태값만 변경
        post.changeDeleteStatus(true);
    }
    

	// 5. [공통] 목록 조회 (소프트 삭제 필터링 적용)
    @Override
    @Transactional(readOnly = true)
    public Page<PostListResponseDTO> getInquiryList(Pageable pageable) {
        // 1. 먼저 Q&A 게시판 객체를 가져옴
        Board board = boardRepository.findById(2)
                .orElseThrow(() -> new NoSuchElementException("게시판을 찾을 수 없습니다."));

        // 2. 작성하신 1번 메서드 호출
        return postRepository.findByBoardAndIsDeletedFalse(board, pageable)
                .map(PostListResponseDTO::new);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostListResponseDTO> getNoticeList(Pageable pageable) {
        // 1. 공지사항 게시판 객체를 가져옴
        Board board = boardRepository.findById(1)
                .orElseThrow(() -> new NoSuchElementException("게시판을 찾을 수 없습니다."));

        // 2. 작성하신 1번 메서드 호출
        return postRepository.findByBoardAndIsDeletedFalse(board, pageable)
                .map(PostListResponseDTO::new);
    }
	    
    
}