package com.example.gmall.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.example.gmall.domain.QAnswer;
import com.example.gmall.domain.QMember;
import com.example.gmall.domain.QPost;
import com.example.gmall.dto.board.PostListResponseDTO;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PostRepositoryCustomImpl implements PostRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<PostListResponseDTO> getPostList(Integer boardId, Pageable pageable) {
		
		QPost post = QPost.post;
		QMember member = QMember.member;
		QAnswer answer = QAnswer.answer;

		List<PostListResponseDTO> content = queryFactory
				.select(Projections.fields(PostListResponseDTO.class,
						post.postId,
						post.title,
						member.mname.as("writerName"),
						post.createdAt,
						post.viewCount,
						post.isPublic,
						answer.answerId.isNotNull().as("hasAnswer")
				))
				.from(post)
				.leftJoin(post.member, member)
				.leftJoin(post.answers, answer)
				.where(post.board.boardId.eq(boardId)) // Integer 타입으로 매칭 완료
				.offset(pageable.getOffset())
				.limit(pageable.getPageSize())
				.orderBy(post.postId.desc())
				.fetch();

		// 전체 카운트 조회
		Long total = queryFactory
				.select(post.count())
				.from(post)
				.where(post.board.boardId.eq(boardId))
				.fetchOne();

		return new PageImpl<>(content, pageable, total != null ? total : 0L);
	}
}