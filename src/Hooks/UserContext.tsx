import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('https://fiyasko-blog-api.vercel.app/profile', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          return null;
        }
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, isDarkTheme, toggleTheme }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;