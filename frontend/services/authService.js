// API 엔드포인트 (실제 서버용)
const API_URL = 'https://cureat.onrender.com/auth';

// 개발 모드일 경우 테스트용 함수를 임포트
let testLogin;
if (__DEV__) {
  testLogin = require('./authServiceTest').login;
}

/**
 * 사용자 로그인을 처리하는 함수 (환경에 따라 다르게 작동)
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<object>} - 로그인 응답 데이터 (토큰 등)
 */
export const login = async (email, password) => {
  if (__DEV__) {
    // 개발 모드에서는 테스트용 함수 사용
    return testLogin(email, password);
  }

// 프로덕션 모드에서는 실제 API 호출
try {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password: password }), // 이 부분을 수정
  });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
};
