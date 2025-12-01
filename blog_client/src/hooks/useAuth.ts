// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import useUserStore from '../store/useAuthStore';


export const useAuth = () => {
  const userStore = useUserStore();
  const token = localStorage.getItem('token');
  
  // Determine if user is authenticated
  const isAuthenticated = !!token;
  
  return {
    isAuthenticated,
    token,
    userStore // pass the entire store if needed
  };
};