package com.example.gmall.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.example.gmall.domain.QAnswer;
import com.example.gmall.domain.QMember;
import com.example.gmall.domain.QPost;
import com.example.gmall.dto.board.PostListResponseDTO;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PostRepositoryCustomImpl implements PostRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<PostListResponseDTO> getPostList(Integer boardId, Pageable pageable) {
		return getPostList(boardId, null, null, null, pageable);
	}

	@Override
	public Page<PostListResponseDTO> getPostList(Integer boardId, String keyword, Pageable pageable) {
		return getPostList(boardId, keyword, null, null, pageable);
	}

	@Override
	public Page<PostListResponseDTO> getPostList(Integer boardId, String keyword, Boolean hasAnswer, Boolean isPublic, Pageable pageable) {

		QPost post = QPost.post;
		QMember member = QMember.member;
		QAnswer answer = QAnswer.answer;

		BooleanBuilder where = new BooleanBuilder();
		where.and(post.board.boardId.eq(boardId));
		where.and(post.isDeleted.eq(false));

		if (keyword != null && !keyword.trim().isEmpty()) {
			where.and(post.title.containsIgnoreCase(keyword.trim()));
		}

		if (isPublic != null) {
			where.and(post.isPublic.eq(isPublic));
		}

		// 답변 유무 서브쿼리 필터
		QAnswer answerSub = new QAnswer("answerSub");
		if (hasAnswer != null) {
			BooleanExpression answerExists = JPAExpressions
					.selectOne()
					.from(answerSub)
					.where(answerSub.post.eq(post), answerSub.isDeleted.eq(false))
					.exists();

			if (hasAnswer) {
				where.and(answerExists);
			} else {
				where.and(answerExists.not());
			}
		}

		List<PostListResponseDTO> content = queryFactory
				.select(Projections.fields(PostListResponseDTO.class,
						post.postId,
						post.title,
						member.mname.as("mName"),
						member.loginId.as("loginId"),
						member.id.as("memberId"),
						post.content,
						post.createdAt,
						post.viewCount,
						post.isPublic,
						answer.answerId.isNotNull().as("hasAnswer")
				))
				.from(post)
				.leftJoin(post.member, member)
				.leftJoin(post.answers, answer)
				.where(where)
				.groupBy(post.postId)
				.offset(pageable.getOffset())
				.limit(pageable.getPageSize())
				.orderBy(post.postId.desc())
				.fetch();

		Long total = queryFactory
				.select(post.count())
				.from(post)
				.where(where)
				.fetchOne();

		return new PageImpl<>(content, pageable, total != null ? total : 0L);
	}
}
