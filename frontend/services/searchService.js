// frontend/services/searchService.js

// API 엔드포인트
const API_URL = 'https://your-backend-api.com/api/search'; // 실제 백엔드 URL로 변경해주세요.

/**
 * 사용자 검색어를 백엔드로 전송하는 함수
 * @param {string} query - 사용자가 입력한 검색어
 * @returns {Promise<object>} - 검색 결과 데이터
 */
export const search = async (query) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '검색에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};
