import React, { createContext, useContext, useState } from 'react';

// 1. Context 생성
const AuthContext = createContext();

// 2. Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // TODO: 실제 프로젝트에서는 토큰을 로컬 스토리지에 저장하고, 앱 실행 시 불러와야 합니다.
  // 이 부분은 나중에 추가하도록 하겠습니다.

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    // TODO: 로그인 성공 시 받은 토큰을 안전한 곳에 저장하는 로직 추가
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // TODO: 저장된 토큰을 삭제하는 로직 추가
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. 커스텀 훅
// 이 훅을 사용하면 어떤 컴포넌트에서든 컨텍스트 값에 쉽게 접근할 수 있습니다.
export const useAuth = () => useContext(AuthContext);
