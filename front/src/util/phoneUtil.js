// 숫자만 추출 (DB 저장용)
export const stripPhone = (value) => value.replace(/[^0-9]/g, "");

// 표시용 하이픈 포맷 (브라우저 표기용)
export const formatPhone = (value) => {
    const numbers = value.replace(/[^0-9]/g, "");

    // 휴대폰: 010-XXXX-XXXX (11자리)
    if (numbers.startsWith("010")) {
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }

    // 휴대폰 (011, 016, 017, 018, 019): 3-3-4 또는 3-4-4
    if (/^01[1-9]/.test(numbers)) {
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }

    // 서울 유선 (02): 2-3-4 또는 2-4-4
    if (numbers.startsWith("02")) {
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 5) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
        if (numbers.length <= 9) return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
        return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
    }

    // 지역 유선 (031~099): 3-3-4 또는 3-4-4
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};