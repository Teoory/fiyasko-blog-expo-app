import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedToken) {
          setToken(storedToken);
          await fetchUserInfo(storedToken);
          await fetchDarkMode(storedToken);
        } else {
          const storedDarkMode = await AsyncStorage.getItem('darkMode');
          setIsDarkTheme(storedDarkMode === 'true');
        }
      } catch (error) {
        console.error('Error initializing settings:', error);
      }
    };
    initializeSettings();
  }, []);

  const fetchUserInfo = async (storedToken) => {
    if (!storedToken) return;
    try {
      const response = await fetch('https://fiyasko-blog-api.vercel.app/profile', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      } else {
        console.info('Failed to fetch user data: Status', response.status);
      }
    } catch (error) {
      console.info('Error fetching user info:', error);
    }
  };

  const fetchDarkMode = async (storedToken) => {
    if (!storedToken) return;
    try {
      const response = await fetch('https://fiyasko-blog-api.vercel.app/mobileDarkmode', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });
      
      if (response.ok) {
        const darkMode = await response.json();
        setIsDarkTheme(darkMode);
        await AsyncStorage.setItem('darkMode', darkMode.toString());
      } else {
        console.error('Failed to fetch dark mode setting: Status', response.status);
      }
    } catch (error) {
      console.error('Error fetching dark mode setting:', error);
    }
  };

  const toggleTheme = async () => {
    if (token) {
      try {
        const response = await fetch('https://fiyasko-blog-api.vercel.app/mobileDarkmode', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const updatedDarkMode = await response.json();
          setIsDarkTheme(updatedDarkMode);
          await AsyncStorage.setItem('darkMode', updatedDarkMode.toString());
        } else {
          console.error('Failed to toggle dark mode on server: Status', response.status);
        }
      } catch (error) {
        console.error('Error toggling dark mode:', error);
      }
    } else {
      const newTheme = !isDarkTheme;
      setIsDarkTheme(newTheme);
      await AsyncStorage.setItem('darkMode', newTheme.toString());
    }
  };

  const saveUserInfo = async (data, userToken) => {
    try {
      if (userToken) {
        await AsyncStorage.setItem('token', userToken);
        setToken(userToken);
      }
      setUserInfo(data);
      await fetchDarkMode(userToken);
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserInfo(null);
      setToken(null);
      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      setIsDarkTheme(storedDarkMode === 'true');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo: saveUserInfo, token, isDarkTheme, toggleTheme, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
