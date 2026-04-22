import { useState, useEffect, useCallback } from 'react';
import {
  getMember,
  isLoggedIn,
  getRole,
  isAdmin,
  isSeller,
  isGeneralMember,
  getMemberId,
  isOwner,
  isOwnerOrAdmin,
  ROLE,
} from '../util/authUtil';

/**
 * 로그인 상태와 역할 정보를 반환
 * localStorage 'member' 변경을 감지하여 자동 갱신
 */
const useAuth = () => {
  const [member, setMember] = useState(() => getMember());

  // localStorage 변경 감지 (다른 탭에서 로그인/로그아웃 시에도 반영)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'member' || e.key === null) {
        setMember(getMember());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 같은 탭 내 변경 감지용 (커스텀 이벤트)
    const handleAuthChange = () => setMember(getMember());
    window.addEventListener('auth-changed', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  // 소유권 확인 (특정 리소스의 작성자 본인인지)
  const checkOwner = useCallback((targetMemberId) => {
    return isOwner(targetMemberId);
  }, [member]);

  const checkOwnerOrAdmin = useCallback((targetMemberId) => {
    return isOwnerOrAdmin(targetMemberId);
  }, [member]);

  return {
    member,                       // 전체 member 객체
    isLoggedIn: isLoggedIn(),    // 로그인 여부
    role: getRole(),             // 현재 역할 (숫자)
    isAdmin: isAdmin(),          // 관리자 여부
    isSeller: isSeller(),        // 판매회원 여부
    isGeneralMember: isGeneralMember(), // 일반회원 여부
    memberId: getMemberId(),     // 현재 사용자 id
    checkOwner,                  // 작성자 본인 확인 함수
    checkOwnerOrAdmin,           // 작성자 또는 관리자 확인 함수
    ROLE,                        // 역할 상수
  };
};

export default useAuth;
