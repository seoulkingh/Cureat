import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import HomeUI from '../../components/HomeUI';

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return <HomeUI handleLogout={handleLogout} />;
}
