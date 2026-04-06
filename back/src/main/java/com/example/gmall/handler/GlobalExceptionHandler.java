package com.example.gmall.handler;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	// @Valid 검증 실패
	// 발생 : UserSignupDTO 필드 검증 실패시
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidException(
			MethodArgumentNotValidException ex){
		List<Map<String, String>> errors = ex.getBindingResult()
				.getFieldErrors()
				.stream()
				.map(e -> Map.of(
						"field", e.getField(),
						"defaultMessage", e.getDefaultMessage()
						))
				.collect(Collectors.toList());
		log.warn("유효성 검증 실패: {}",errors);
		
		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(Map.of("errors",errors));
	}
	
	// 권한 부족 (403)
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<Map<String, String>> handleAccessDenied(
			AccessDeniedException ex) {
		log.warn("접근 권한 부족: {}", ex.getMessage());

		return ResponseEntity
				.status(HttpStatus.FORBIDDEN)
				.body(Map.of("message", ex.getMessage()));
	}

	// 리소스 없음 (404)
	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<Map<String, String>> handleNotFound(
			NoSuchElementException ex) {
		log.warn("리소스 없음: {}", ex.getMessage());

		return ResponseEntity
				.status(HttpStatus.NOT_FOUND)
				.body(Map.of("message", ex.getMessage()));
	}

	//비즈니스 예외
	//발생 아이디 중복 / 전화번호 중복/ 인증코드 불일치 등
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, String>> handleIllegalArgument(
			IllegalArgumentException ex){
		log.warn("비즈니스 예외 발생: {}",ex.getMessage());
		
		return ResponseEntity 
				.status(HttpStatus.BAD_REQUEST)
				.body(Map.of("message",ex.getMessage()));
	}
	
	//필수 요청 파라미터 누락
	// 발생: GET //check-id?loginId= 에서 loginId 누락 시
	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<Map<String, String>> handleMissingParam(
			MissingServletRequestParameterException ex){
		log.warn("필수 파라미터 누락: {}", ex.getParameterName());
		
		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(Map.of("message",ex.getParameterName() + "파라미터가 필요합니다."));
	}
	
	// 파일 업로드 크기 초과
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<Map<String, String>> handleMaxUploadSize(
	        MaxUploadSizeExceededException ex) {
		 // 더 자세한 로그
	    log.warn("파일 업로드 크기 초과");
	    log.warn("getMessage: {}", ex.getMessage());
	    log.warn("getCause: {}", ex.getCause() != null ? ex.getCause().getMessage() : "null");
	    log.warn("getMostSpecificCause: {}", ex.getMostSpecificCause().getMessage());
	    
	    // 실제 제한 크기 확인
	    if (ex.getCause() != null) {
	        log.warn("원인 클래스: {}", ex.getCause().getClass().getName());
	    }
	    
	    return ResponseEntity
	            .status(HttpStatus.BAD_REQUEST)
	            .body(Map.of("message", ex.getMostSpecificCause().getMessage()));
	}
	
	//그 외 예상치 못한 서버 오류
	// 발생: NullPointerException, DB 연결 오류 등
	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleException(Exception ex){
		
		log.error("서버 오류 발생 : {}", ex.getMessage(),ex);
		
		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of("message","서버 오류가 발생했습니다."));
	}
}
