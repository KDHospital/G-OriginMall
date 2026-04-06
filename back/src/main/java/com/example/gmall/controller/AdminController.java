package com.example.gmall.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.domain.Member;
import com.example.gmall.domain.Orders;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.OrdersRepository;
import com.example.gmall.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Log4j2
@Transactional
public class AdminController {

	private final MemberService memberService;
	private final MemberRepository memberRepository;
	private final OrdersRepository ordersRepository;
	private final PasswordEncoder passwordEncoder;

	// [관리자] 일반회원(role=0) 목록 조회
	@GetMapping("/members")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getMemberList(
			@RequestParam(name = "keyword", required = false) String keyword,
			@RequestParam(name = "status", required = false) String status,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {

		Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
		Page<Member> result;

		if ("active".equals(status)) {
			if (keyword != null && !keyword.trim().isEmpty()) {
				result = memberRepository.findByRoleAndIsDeletedAndKeyword((byte) 0, false, keyword.trim(), pageable);
			} else {
				result = memberRepository.findByRoleAndIsDeletedFalse((byte) 0, pageable);
			}
		} else if ("withdrawn".equals(status)) {
			if (keyword != null && !keyword.trim().isEmpty()) {
				result = memberRepository.findByRoleAndIsDeletedAndKeyword((byte) 0, true, keyword.trim(), pageable);
			} else {
				result = memberRepository.findByRoleAndIsDeletedTrue((byte) 0, pageable);
			}
		} else {
			if (keyword != null && !keyword.trim().isEmpty()) {
				result = memberRepository.findByRoleAndKeyword((byte) 0, keyword.trim(), pageable);
			} else {
				result = memberRepository.findByRole((byte) 0, pageable);
			}
		}

		var dtoList = result.getContent().stream().map(m -> {
			java.util.Map<String, Object> map = new java.util.HashMap<>();
			map.put("id", m.getId());
			map.put("loginId", m.getLoginId());
			map.put("mname", m.getMname());
			map.put("tel", m.getTel());
			map.put("email", m.getEmail());
			map.put("gender", m.getGender() != null ? (int) m.getGender() : 0);
			map.put("isDeleted", m.isDeleted());
			map.put("createdAt", m.getCreatedAt() != null ? m.getCreatedAt().toString() : "");
			map.put("withdrawAt", m.getWithdrawAt() != null ? m.getWithdrawAt().toString() : "");
			return map;
		}).toList();

		return ResponseEntity.ok(Map.of("dtoList", dtoList, "totalCount", result.getTotalElements()));
	}

	// [관리자] 회원 상세 조회
	@GetMapping("/members/{memberId}")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getMemberDetail(@PathVariable("memberId") Long memberId) {
		Member m = memberRepository.findById(memberId)
				.orElseThrow(() -> new java.util.NoSuchElementException("회원을 찾을 수 없습니다."));

		java.util.Map<String, Object> result = new java.util.HashMap<>();
		result.put("id", m.getId());
		result.put("loginId", m.getLoginId());
		result.put("mname", m.getMname());
		result.put("tel", m.getTel());
		result.put("email", m.getEmail());
		result.put("gender", m.getGender() != null ? (int) m.getGender() : 0);
		result.put("role", (int) m.getRole());
		result.put("emailVerified", m.isEmailVerified());
		result.put("isDeleted", m.isDeleted());
		result.put("createdAt", m.getCreatedAt() != null ? m.getCreatedAt().toString() : "");
		result.put("updatedAt", m.getUpdatedAt() != null ? m.getUpdatedAt().toString() : "");
		result.put("withdrawAt", m.getWithdrawAt() != null ? m.getWithdrawAt().toString() : "");

		return ResponseEntity.ok(result);
	}

	// [관리자] 회원 주문 목록 조회
	@GetMapping("/members/{memberId}/orders")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getMemberOrders(
			@PathVariable("memberId") Long memberId,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size) {

		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<Orders> result = ordersRepository.findByMemberIdOrderByCreatedAtDesc(memberId, pageable);

		var dtoList = result.getContent().stream().map(o -> {
			java.util.Map<String, Object> map = new java.util.HashMap<>();
			map.put("orderId", o.getOrderId());
			map.put("tossOrderId", o.getTossOrderId() != null ? o.getTossOrderId() : "ORDER_" + o.getOrderId());
			map.put("totalPrice", o.getTotalPrice());
			map.put("status", (int) o.getStatus());
			map.put("createdAt", o.getCreatedAt() != null ? o.getCreatedAt().toString() : "");
			map.put("receiverName", o.getReceiverName());
			map.put("sellerId", o.getSeller() != null ? o.getSeller().getId() : null);

			var items = o.getOrderItems();
			if (items != null && !items.isEmpty()) {
				var itemList = items.stream().map(item -> {
					java.util.Map<String, Object> itemMap = new java.util.HashMap<>();
					itemMap.put("productName", item.getProductName());
					itemMap.put("quantity", item.getQuantity());
					itemMap.put("price", item.getPrice());
					itemMap.put("subtotal", item.getSubtotal());
					return itemMap;
				}).toList();
				map.put("items", itemList);
			} else {
				map.put("items", java.util.List.of());
			}
			return map;
		}).toList();

		return ResponseEntity.ok(Map.of("dtoList", dtoList, "totalCount", result.getTotalElements()));
	}

	// [관리자] 회원 등록
	@PostMapping("/members")
	public ResponseEntity<?> createMember(@RequestBody Map<String, Object> body) {
		String loginId = (String) body.get("loginId");
		String mname = (String) body.get("mname");
		String mpwd = (String) body.get("mpwd");
		String tel = (String) body.get("tel");
		String email = (String) body.get("email");
		Number genderNum = (Number) body.getOrDefault("gender", 0);

		if (loginId == null || mname == null || mpwd == null || tel == null || email == null) {
			throw new IllegalArgumentException("필수 항목을 모두 입력해주세요.");
		}
		if (memberRepository.existsByLoginId(loginId)) {
			throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
		}

		Member member = Member.builder()
				.loginId(loginId)
				.mname(mname)
				.mpwd(passwordEncoder.encode(mpwd))
				.tel(tel)
				.email(email)
				.gender(genderNum.byteValue())
				.role((byte) 0)
				.emailVerified(true)
				.build();

		Member saved = memberRepository.save(member);
		return ResponseEntity.ok(Map.of("message", "회원이 등록되었습니다.", "id", saved.getId()));
	}

	// [관리자] 회원 수정
	@PutMapping("/members/{memberId}")
	public ResponseEntity<?> updateMember(
			@PathVariable("memberId") Long memberId,
			@RequestBody Map<String, Object> body) {

		Member member = memberRepository.findById(memberId)
				.orElseThrow(() -> new java.util.NoSuchElementException("회원을 찾을 수 없습니다."));

		if (body.containsKey("mname")) member.changeName((String) body.get("mname"));
		if (body.containsKey("tel")) member.changeTel((String) body.get("tel"));
		if (body.containsKey("gender")) {
			Number genderNum = (Number) body.get("gender");
			member.changeGender(genderNum.byteValue());
		}
		if (body.containsKey("mpwd")) {
			String newPwd = (String) body.get("mpwd");
			if (newPwd != null && !newPwd.trim().isEmpty()) {
				member.changePassword(passwordEncoder.encode(newPwd));
			}
		}

		return ResponseEntity.ok(Map.of("message", "회원 정보가 수정되었습니다."));
	}

	// [관리자] 판매회원 수정
	@PutMapping("/sellers/{memberId}")
	public ResponseEntity<?> updateSeller(
			@PathVariable("memberId") Long memberId,
			@RequestBody Map<String, Object> body) {
		Member seller = memberRepository.findById(memberId)
				.orElseThrow(() -> new java.util.NoSuchElementException("판매회원을 찾을 수 없습니다."));

		if (body.containsKey("mname")) seller.changeName((String) body.get("mname"));
		if (body.containsKey("tel")) seller.changeTel((String) body.get("tel"));
		if (body.containsKey("businessVerified")) seller.updateBusinessVerify((Boolean) body.get("businessVerified"));
		if (body.containsKey("mpwd")) {
			String newPwd = (String) body.get("mpwd");
			if (newPwd != null && !newPwd.trim().isEmpty()) {
				seller.changePassword(passwordEncoder.encode(newPwd));
			}
		}

		return ResponseEntity.ok(Map.of("message", "판매회원 정보가 수정되었습니다."));
	}

	// [관리자] 회원 삭제 (비활성화)
	@PostMapping("/members/{memberId}/delete")
	public ResponseEntity<?> deleteMember(@PathVariable("memberId") Long memberId) {
		Member member = memberRepository.findById(memberId)
				.orElseThrow(() -> new java.util.NoSuchElementException("회원을 찾을 수 없습니다."));
		member.changeDeleteStatus(true);
		return ResponseEntity.ok(Map.of("message", "회원이 비활성화되었습니다."));
	}

	//입점 승인
	@PostMapping("/approve-seller/{memberId}")
	public ResponseEntity<?> approve(@PathVariable("memberId") Long memberId){

		log.info("판매자 승인 요청 - ID: {}", memberId);

		memberService.approveSeller(memberId);
		return ResponseEntity.ok(Map.of("message","판매자 입점 승인 완료되었습니다."));
	}


	//입점 거절
	@PostMapping("/reject-seller/{memberId}")
	public ResponseEntity<?> reject(@PathVariable("memberId") Long memberId){

		log.info("판재마 거절 요청 -ID: {}",memberId);

		memberService.rejectSeller(memberId);
		return ResponseEntity.ok(Map.of("message","판매자 입점 신청이 거절되었습니다."));
	}
	
	@GetMapping("/seller-list")
	public ResponseEntity<?> getPendingSellers() {
		log.info("승인 대기 중인 판매자 목록 조회");
		
		return ResponseEntity.ok(memberService.getPendingSellerList());
	}

	// ===== 판매회원 관리 =====

	// [관리자] 판매회원 목록 (승인여부/회원상태 필터)
	@GetMapping("/sellers")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getSellerList(
			@RequestParam(name = "keyword", required = false) String keyword,
			@RequestParam(name = "verified", required = false) Boolean verified,
			@RequestParam(name = "status", required = false) String status,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {

		Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

		// 기본 role=1 조건으로 전체 조회 후 동적 필터링
		Page<Member> result = memberRepository.findSellersByFilters(
				(byte) 1,
				keyword != null && !keyword.trim().isEmpty() ? keyword.trim() : null,
				verified,
				"active".equals(status) ? false : ("withdrawn".equals(status) ? true : null),
				pageable
		);

		var dtoList = result.getContent().stream().map(m -> {
			java.util.Map<String, Object> map = new java.util.HashMap<>();
			map.put("id", m.getId());
			map.put("loginId", m.getLoginId());
			map.put("mname", m.getMname());
			map.put("tel", m.getTel());
			map.put("email", m.getEmail());
			map.put("businessNo", m.getBusinessNo() != null ? m.getBusinessNo() : "");
			map.put("businessVerified", m.isBusinessVerified());
			map.put("isDeleted", m.isDeleted());
			map.put("createdAt", m.getCreatedAt() != null ? m.getCreatedAt().toString() : "");
			return map;
		}).toList();

		return ResponseEntity.ok(Map.of("dtoList", dtoList, "totalCount", result.getTotalElements()));
	}

	// [관리자] 판매회원 상세
	@GetMapping("/sellers/{memberId}")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getSellerDetail(@PathVariable("memberId") Long memberId) {
		Member m = memberRepository.findById(memberId)
				.orElseThrow(() -> new java.util.NoSuchElementException("판매회원을 찾을 수 없습니다."));

		java.util.Map<String, Object> result = new java.util.HashMap<>();
		result.put("id", m.getId());
		result.put("loginId", m.getLoginId());
		result.put("mname", m.getMname());
		result.put("tel", m.getTel());
		result.put("email", m.getEmail());
		result.put("businessNo", m.getBusinessNo() != null ? m.getBusinessNo() : "");
		result.put("businessVerified", m.isBusinessVerified());
		result.put("taxInvoice", m.isTaxInvoice());
		result.put("cashReceiptNo", m.getCashReceiptNo() != null ? m.getCashReceiptNo() : "");
		result.put("isVerified", m.isVerified());
		result.put("settlementName", m.getSettlementName() != null ? m.getSettlementName() : "");
		result.put("settlementBank", m.getSettlementBank() != null ? m.getSettlementBank() : "");
		result.put("bankAccount", m.getBankAccount() != null ? m.getBankAccount() : "");
		result.put("description", m.getDescription() != null ? m.getDescription() : "");
		result.put("createdAt", m.getCreatedAt() != null ? m.getCreatedAt().toString() : "");

		return ResponseEntity.ok(result);
	}

	// ===== 관리자 설정 =====

	// [관리자] 관리자 계정 목록
	@GetMapping("/admins")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getAdminList(
			@RequestParam(name = "keyword", required = false) String keyword,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size) {

		Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
		Page<Member> result;

		if (keyword != null && !keyword.trim().isEmpty()) {
			result = memberRepository.findByRoleAndKeyword((byte) 2, keyword.trim(), pageable);
		} else {
			result = memberRepository.findByRole((byte) 2, pageable);
		}

		var dtoList = result.getContent().stream().map(m -> {
			java.util.Map<String, Object> map = new java.util.HashMap<>();
			map.put("id", m.getId());
			map.put("loginId", m.getLoginId());
			map.put("mname", m.getMname());
			map.put("tel", m.getTel());
			map.put("email", m.getEmail());
			map.put("createdAt", m.getCreatedAt() != null ? m.getCreatedAt().toString() : "");
			return map;
		}).toList();

		return ResponseEntity.ok(Map.of("dtoList", dtoList, "totalCount", result.getTotalElements()));
	}

	// [관리자] 관리자 계정 상세
	@GetMapping("/admins/{memberId}")
	@Transactional(readOnly = true)
	public ResponseEntity<?> getAdminDetail(@PathVariable("memberId") Long memberId) {
		Member m = memberRepository.findById(memberId)
				.orElseThrow(() -> new java.util.NoSuchElementException("관리자를 찾을 수 없습니다."));

		java.util.Map<String, Object> result = new java.util.HashMap<>();
		result.put("id", m.getId());
		result.put("loginId", m.getLoginId());
		result.put("mname", m.getMname());
		result.put("tel", m.getTel());
		result.put("email", m.getEmail());
		result.put("createdAt", m.getCreatedAt() != null ? m.getCreatedAt().toString() : "");
		result.put("updatedAt", m.getUpdatedAt() != null ? m.getUpdatedAt().toString() : "");

		return ResponseEntity.ok(result);
	}

	// [관리자] 관리자 계정 생성
	@PostMapping("/admins")
	public ResponseEntity<?> createAdmin(@RequestBody Map<String, Object> body) {
		String loginId = (String) body.get("loginId");
		String mname = (String) body.get("mname");
		String mpwd = (String) body.get("mpwd");
		String tel = (String) body.get("tel");
		String email = (String) body.get("email");

		if (loginId == null || mname == null || mpwd == null || tel == null || email == null) {
			throw new IllegalArgumentException("필수 항목을 모두 입력해주세요.");
		}
		if (memberRepository.existsByLoginId(loginId)) {
			throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
		}

		Member admin = Member.builder()
				.loginId(loginId)
				.mname(mname)
				.mpwd(passwordEncoder.encode(mpwd))
				.tel(tel)
				.email(email)
				.gender((byte) 0)
				.role((byte) 2)
				.emailVerified(true)
				.build();

		Member saved = memberRepository.save(admin);
		return ResponseEntity.ok(Map.of("message", "관리자가 등록되었습니다.", "id", saved.getId()));
	}

	// [관리자] 관리자 계정 수정
	@PutMapping("/admins/{memberId}")
	public ResponseEntity<?> updateAdmin(
			@PathVariable("memberId") Long memberId,
			@RequestBody Map<String, Object> body) {

		Member admin = memberRepository.findById(memberId)
				.orElseThrow(() -> new java.util.NoSuchElementException("관리자를 찾을 수 없습니다."));

		if (body.containsKey("mname")) admin.changeName((String) body.get("mname"));
		if (body.containsKey("tel")) admin.changeTel((String) body.get("tel"));
		if (body.containsKey("mpwd")) {
			String newPwd = (String) body.get("mpwd");
			if (newPwd != null && !newPwd.trim().isEmpty()) {
				admin.changePassword(passwordEncoder.encode(newPwd));
			}
		}

		return ResponseEntity.ok(Map.of("message", "관리자 정보가 수정되었습니다."));
	}

	// [관리자] 관리자 계정 삭제
	@PostMapping("/admins/{memberId}/delete")
	public ResponseEntity<?> deleteAdmin(@PathVariable("memberId") Long memberId) {
		Member admin = memberRepository.findById(memberId)
				.orElseThrow(() -> new java.util.NoSuchElementException("관리자를 찾을 수 없습니다."));

		if (admin.getRole() != 2) {
			throw new IllegalArgumentException("관리자 계정만 삭제할 수 있습니다.");
		}

		admin.changeDeleteStatus(true);
		return ResponseEntity.ok(Map.of("message", "관리자 계정이 비활성화되었습니다."));
	}
}
