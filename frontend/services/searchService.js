import { search as testSearch } from './searchServiceTest';

const API_ENDPOINT = 'https://your-backend-api.com/search';

export const search = async (query) => {
  if (__DEV__) {
    console.log('Using mock search service in development mode.');
    return testSearch(query);
  }

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
