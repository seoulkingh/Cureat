// frontend/services/authService.js

// API 엔드포인트
const API_URL = 'https://cureat.onrender.com/auth';

/**
 * 사용자 로그인을 처리하는 함수
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<object>} - 로그인 응답 데이터 (토큰 등)
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // 서버에서 오류 응답을 보낼 경우
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    // 로그인 성공 시 응답 데이터 반환
    return data;

  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error; // 에러를 다시 던져서 컴포넌트에서 처리할 수 있도록 함
  }
};
