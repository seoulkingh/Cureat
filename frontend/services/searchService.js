// frontend/services/searchService.js
import { search as testSearch } from './searchServiceTest';

// TODO: 아래 API_ENDPOINT를 당신의 맥북 IP 주소로 수정하세요.
const API_BASE_URL = 'http://192.168.45.54:8000';

/**
 * 백엔드로 검색어를 전송하여 로그를 남기는 함수
 * @param {string} query 사용자가 입력한 검색어
 */
export const saveSearchLog = async (query) => {
  if (!query) {
    console.log('전송할 검색어가 없습니다.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/search-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error(`API 호출 중 오류 발생: ${response.status}`);
    }

    const data = await response.json();
    console.log('로그 저장 백엔드 응답:', data.message);

    return data;
  } catch (error) {
    console.error('로그 저장 API 호출 중 오류 발생:', error);
    throw new Error('통신 오류가 발생했습니다.');
  }
};

/**
 * 백엔드에서 모든 검색 결과를 불러와 필터링하는 함수
 * @param {string} query 사용자가 입력한 검색어
 * @returns {Promise<object[]>} 필터링된 검색 결과 목록
 */
export const search = async (query) => {
  // 개발 모드에서는 Mock 데이터를 사용합니다.
  // if (__DEV__) {
  //   console.log('개발 모드입니다. Mock 데이터를 사용합니다.');
  //   return testSearch(query);
  // }

  try {
    // 1. 백엔드에서 모든 검색 결과를 가져옵니다.
    // const response = await fetch(`${API_BASE_URL}/search-results`);
    const response = await fetch(`${API_BASE_URL}/restaurant_recommendations`);
    if (!response.ok) {
      throw new Error(`결과 API 호출 중 오류 발생: ${response.status}`);
    }
    const allResults = await response.json();

    // 2. 검색어가 없으면 전체 결과를 반환합니다.
    if (!query) {
      return allResults;
    }

    // 3. 검색어(단일 문자열)를 기준으로 데이터를 필터링합니다.
    const lowerCaseQuery = query.toLowerCase();
    // const filteredResults = allResults.filter(item => {
    //   const itemName = item.name.toLowerCase();
    //   const itemDescription = item.description.toLowerCase();
    //   const itemTags = item.tags.map(tag => tag.toLowerCase());

    //   return itemName.includes(lowerCaseQuery) || 
    //          itemDescription.includes(lowerCaseQuery) || 
    //          itemTags.includes(lowerCaseQuery);
    // });

    const filteredResults = allResults.filter(item => {
      const itemName = item.name.toLowerCase();
      const itemKeywords = item.keywords.map(keyword => keyword.toLowerCase());
      return (
        itemName.includes(lowerCaseQuery) ||
        itemKeywords.some(keyword => keyword.includes(lowerCaseQuery))
      );
    });



    return filteredResults;

  } catch (error) {
    console.error('검색 API 호출 중 오류 발생:', error);
    throw new Error('검색 오류가 발생했습니다.');
  }
};