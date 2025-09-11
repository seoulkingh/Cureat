import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext'; // AuthProvider를 임포트합니다.

export default function RootLayout() {
  return (
    // 앱의 모든 페이지를 AuthProvider로 감쌉니다.
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login/login" options={{ headerShown: false }} />
        <Stack.Screen name="home/index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
