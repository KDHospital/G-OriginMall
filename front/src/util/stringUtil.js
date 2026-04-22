/**
 * 문자열 관련 공통 유틸.
 */

/**
 * 이름 마스킹 처리.
 * - 한글: 2자 → 홍*, 3자 → 홍*동, 그 이상 → 첫자*중간자마지막자
 * - 영문: 각 단어 첫자+마지막자 사이를 * 로 치환
 */
export const maskName = (name) => {
  if (!name) return '익명';
  const isEnglish = /^[a-zA-Z\s]+$/.test(name);
  if (isEnglish) {
    return name.split(' ').map(word => {
      if (word.length <= 2) return word[0] + '*';
      return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
    }).join(' ');
  }
  if (name.length === 1) return '*';
  if (name.length === 2) return name[0] + '*';
  if (name.length === 3) return name[0] + '*' + name[2];
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
};
