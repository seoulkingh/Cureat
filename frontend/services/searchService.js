// frontend/services/searchService.js
// 이 파일은 실제 검색 백엔드 API와의 통신을 담당합니다.

import { search as testSearch } from './searchServiceTest';

// TODO: 아래 API_ENDPOINT를 당신의 맥북 IP 주소로 수정하세요.
const API_ENDPOINT = 'http://192.168.45.114:8000/search-log';

/**
 * 검색어를 백엔드에 전송하여 저장하는 함수
 * @param {string} query 사용자가 입력한 검색어
 */
export const search = async (query) => {
  if (__DEV__) {
    console.log('Using mock search service in development mode.');
    // 현재는 실제 백엔드 테스트를 위해 주석 처리합니다.
    return testSearch(query);
  }

  if (!query) {
    console.log('전송할 검색어가 없습니다.');
    return;
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST', // POST로 변경
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }), // JSON 형식의 body에 `query` 속성으로 전송
    });

    if (!response.ok) {
      throw new Error(`API 호출 중 오류 발생: ${response.status}`);
    }

    const data = await response.json();
    console.log('백엔드 응답:', data.message);

    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw new Error('검색 오류가 발생했습니다.');
  }
};