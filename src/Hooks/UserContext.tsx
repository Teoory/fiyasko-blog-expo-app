import React, { createContext, useState, useEffect } from 'react';

// UserContext oluşturuyoruz
export const UserContext = createContext({});

// Context sağlayıcı bileşeni
export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  
  // Kullanıcı bilgilerini çekmek için useEffect kullanıyoruz
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('https://fiyasko-blog-api.vercel.app/profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error('Kullanıcı bilgisi alınamadı.');
        }
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
