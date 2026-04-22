/**
 * 인증/권한 유틸리티
 * localStorage의 'member' 키를 기준으로 로그인 상태와 역할을 판단.
 *
 * member 객체 구조:
 * { id, loginId, mname, role, businessVerified, result, accessToken, refreshToken }
 *
 * role 값:
 *   0 = 일반회원 (GENERAL)
 *   1 = 판매회원 (SELLER)
 *   2 = 관리자   (ADMIN)
 */

// ===== 역할 상수 =====
export const ROLE = Object.freeze({
  GENERAL: 0,
  SELLER: 1,
  ADMIN: 2,
});

// ===== member 객체 조회 =====
/** localStorage에서 member 객체를 가져옵니다. 없으면 null 반환. */
export const getMember = () => {
  try {
    const raw = localStorage.getItem('member');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('member 파싱 실패:', e);
    return null;
  }
};

// ===== 로그인 상태 =====
/** 로그인 여부 (토큰 존재 기준) */
export const isLoggedIn = () => {
  const member = getMember();
  return !!(member && member.accessToken);
};

// ===== 역할 조회 =====
/** 현재 사용자 역할 (숫자). 비로그인 시 null */
export const getRole = () => {
  const member = getMember();
  return member ? Number(member.role) : null;
};

// ===== 역할 판별 =====
/** 관리자 여부 (role === 2) */
export const isAdmin = () => getRole() === ROLE.ADMIN;

/** 판매회원 여부 (role === 1) */
export const isSeller = () => getRole() === ROLE.SELLER;

/** 일반회원 여부 (role === 0) */
export const isGeneralMember = () => getRole() === ROLE.GENERAL;

/** 특정 역할 이상인지 확인. 예: hasRoleAtLeast(ROLE.SELLER) → 판매회원 또는 관리자 */
export const hasRoleAtLeast = (minRole) => {
  const role = getRole();
  return role !== null && role >= minRole;
};

/** 여러 역할 중 하나와 일치 여부. 예: hasAnyRole([ROLE.SELLER, ROLE.ADMIN]) */
export const hasAnyRole = (roles) => {
  const role = getRole();
  return role !== null && roles.includes(role);
};

// ===== 사용자 정보 조회 =====
/** 현재 사용자의 memberId */
export const getMemberId = () => {
  const member = getMember();
  return member ? member.id : null;
};

/** 현재 사용자의 로그인 아이디 */
export const getLoginId = () => {
  const member = getMember();
  return member ? member.loginId : null;
};

/** 현재 사용자의 이름 */
export const getMemberName = () => {
  const member = getMember();
  return member ? member.mname : null;
};

/** 현재 사용자의 액세스 토큰 */
export const getAccessToken = () => {
  const member = getMember();
  return member ? member.accessToken : null;
};

// ===== 소유권 판별 =====
/**
 * 특정 리소스의 작성자인지 확인.
 * 예: 게시글 작성자 본인만 수정/삭제 가능한 경우.
 */
export const isOwner = (targetMemberId) => {
  const myId = getMemberId();
  return myId !== null && Number(myId) === Number(targetMemberId);
};

/**
 * 작성자 본인 또는 관리자 여부.
 * 예: 게시글 관리 권한 확인.
 */
export const isOwnerOrAdmin = (targetMemberId) => {
  return isOwner(targetMemberId) || isAdmin();
};

// ===== 로그아웃 =====
/**
 * 클라이언트 측 로그아웃 (localStorage 정리).
 * HttpOnly 쿠키(refreshToken)는 서버 로그아웃 API 호출이 별도로 필요.
 */
export const clearMember = () => {
  localStorage.removeItem('member');
};
