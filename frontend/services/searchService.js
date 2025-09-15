// 이 파일은 실제 검색 백엔드 API와의 통신을 담당합니다.
// 개발 환경에서는 searchServiceTest.js를 사용하고,
// 프로덕션 환경에서는 실제 API를 호출합니다.

import { search as testSearch } from './searchServiceTest';

const API_ENDPOINT = 'https://your-backend-api.com/search';

/**
 * 검색어를 기반으로 음식점 목록을 반환하는 함수
 * @param {string[] | string} query 검색어 목록 또는 단일 검색어
 * @returns {Promise<object[]>} 검색 결과 목록
 */
export const search = async (query) => {
  if (__DEV__) {
    console.log('Using mock search service in development mode.');
    return testSearch(query);
  }

  // TODO: 프로덕션 환경에서 실제 API 호출 로직 구현
  try {
    const response = await fetch(`${API_ENDPOINT}?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('API 호출 중 오류 발생');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw new Error('검색 오류가 발생했습니다.');
  }
};
