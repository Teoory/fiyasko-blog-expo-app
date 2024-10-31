import React, { useEffect, useContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Keyboard, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PostDetail from '../screens/PostDetail';
import UserProfile from '../screens/UserProfileScreen';
import UserOwnProfileScreen from '../screens/UserOwnProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import AuthScreen from '../screens/AuthScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NewPostScreen from '../screens/NewPostScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserContext } from '../Hooks/UserContext';
import { tr } from 'date-fns/locale';
import { set } from 'date-fns';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.setNotificationChannelAsync('default', {
  name: 'Default Channel',
  importance: Notifications.AndroidImportance.MAX,
  sound: 'default',
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
  enableLights: true,
  enableVibrate: true,
  showBadge: true,
  
});

function HomeStackNavigator() {
  const { userInfo, isDarkTheme } = useContext(UserContext);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [newNotify, setNewNotify] = useState(false);
  const navigation = useNavigation();


  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      // Kullanıcı bildirime tıkladığında NotificationsScreen'e yönlendirin
      navigation.navigate('NotificationsScreen');
    });

    return () => {
      // Dinleyiciyi kaldırın
      responseListener.remove();
    };
  }, []);

  const resetNotificationStatus = async () => {
    await AsyncStorage.removeItem('notificationSent');
    setNewNotify(false);
  };

  useEffect(() => {
    resetNotificationStatus();
  }, []);

  useEffect(() => {
    const getInitialNotification = async () => {
      const lastNotification = await Notifications.getLastNotificationResponseAsync();
      if (lastNotification) {
        // console.log('Initial Notification:', lastNotification);
      }
    };
    getInitialNotification();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      // console.log('Received Notification:', notification);
      setHasNewNotifications(true);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const checkNewNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const notificationSent = await AsyncStorage.getItem('notificationSent');
        if (!token || !userInfo || notificationSent === 'true' || newNotify == true) return;
        
        const userId = userInfo.id;

        const response = await fetch(`https://fiyasko-blog-api.vercel.app/check-new-notifications?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setHasNewNotifications(data.newNotificationExists);

        if (data.newNotificationExists) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Yeni bildirim! 📬',
              body: 'Yeni bir bildiriminiz var. Hemen kontrol edin! ',
              sound: 'default',
              priority: Notifications.AndroidNotificationPriority.HIGH,
              vibrate: [0, 250, 250, 250],
              data: { screen: 'NotificationsScreen' },
            },
            trigger: null,
          });
          await AsyncStorage.setItem('notificationSent', 'true');
          setNewNotify(true);
        }
      } catch (error) {
        console.info('Error checking notifications:', error);
      }
    };

    // Set an interval to check for notifications every 1 minute
    const intervalId = setInterval(checkNewNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [userInfo]);
  

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: `${isDarkTheme ? '#333' : '#ddd'}`,
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      {/* Ana sayfa */}
      <Stack.Screen 
        name="AnasayfaStack" 
        component={HomeScreen} 
        options={({ navigation }) => ({
          headerTitle: () => (
              <Image 
                source={require('../../assets/logo.png')}
                style={{ width: 120, height: 60 }}
                resizeMode="contain"
              />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
              <Text style={[styles.notificationButton, hasNewNotifications && styles.notificationAlert]}>🔔</Text>
            </TouchableOpacity>
          ),
        })}
      />

      {/* Post Detay Sayfası */}
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetail} 
        options={({ navigation }) => ({
          headerTitle: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Anasayfa')}>
              <Image 
                source={require('../../assets/logo.png')}
                style={{ width: 120, height: 60 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.backButton, isDarkTheme ? null : styles.lightText]}>←</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
              <Text style={[styles.notificationButton, hasNewNotifications && styles.notificationAlert]}>🔔</Text>
            </TouchableOpacity>
          ),
        })}
      />


      {/* UserProfile Sayfası */}
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfile} 
        options={({ navigation }) => ({
          headerTitle: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Anasayfa')}>
              <Image 
                source={require('../../assets/logo.png')}
                style={{ width: 120, height: 60 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.backButton, isDarkTheme ? null : styles.lightText]}>←</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
              <Text style={[styles.notificationButton, hasNewNotifications && styles.notificationAlert]}>🔔</Text>
            </TouchableOpacity>
          ),
        })}
      />

      {/* NotificationsScreen */}
      <Stack.Screen 
        name="NotificationsScreen" 
        component={NotificationsScreen} 
        options={({ navigation }) => ({
          headerTitle: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Anasayfa')}>
              <Image 
                source={require('../../assets/logo.png')}
                style={{ width: 120, height: 60 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.backButton, isDarkTheme ? null : styles.lightText]}>←</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}


function BottomTabNavigator() {
  const { userInfo, isDarkTheme } = useContext(UserContext); 
  return (
    <Tab.Navigator
      initialRouteName="Anasayfa"
      shifting={false}
      labeled={true}
      sceneAnimationEnabled={false}
      activeColor="#518eff"
      inactiveColor={isDarkTheme ? '#ccc' : '#555'}
      activeIndicatorStyle={{ backgroundColor: 'transparent'}}
      barStyle={{ backgroundColor: `${isDarkTheme ? '#333' : '#ddd'}`,borderColor:'#555', borderTopWidth: 0.5, borderTopColor: '#333', elevation: 0, shadowOpacity: 0}}
    >
      <Tab.Screen 
        name="Anasayfa" 
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Anasayfa',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Arama" 
        component={SearchScreen}
        options={{
          tabBarLabel: 'Arama',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={24} />
          ),
        }}
      />

      {userInfo && userInfo.tags.includes('admin') && (
        <Tab.Screen 
          name="newPost" 
          component={NewPostScreen}
          options={{
            tabBarLabel: 'Paylaş',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="plus-circle" color={color} size={24} />
            ),
          }}
        />
      )}

        <Tab.Screen 
          name="Ayarlar" 
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Ayarlar',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="cog" color={color} size={24} />
            ),
          }}
        />

      {userInfo && userInfo.username ? (
        <Tab.Screen 
          name="UserProfile" 
          component={UserOwnProfileScreen}
          options={{
            tabBarLabel: userInfo.username,
            tabBarIcon: ({ color }) => (
              <TouchableOpacity>
                {userInfo.profilePhoto ? (
                  <Image 
                    source={{ uri: userInfo.profilePhoto }}
                    style={{ width: 24, height: 24, borderRadius: 12 }}
                  />
                ) : (
                  <MaterialCommunityIcons name="account" color={color} size={24} />
                )}
              </TouchableOpacity>
            ),
          }}
        />
      ) : (
        <Tab.Screen 
          name="Giris-yap" 
          component={AuthScreen}
          options={{
            tabBarLabel: 'Giriş Yap',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="login" color={color} size={24} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => { 
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
    });

    return () => {
      if (keyboardDidShowListener) keyboardDidShowListener.remove();
      if (keyboardDidHideListener) keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      {/* <HomeStackNavigator /> */}
      <BottomTabNavigator />
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  darkBackground: {
    backgroundColor: '#181a1e',
  },
  lightBackground: {
    backgroundColor: '#f5f5f5',
  },
  lightText: {
    color: '#000',
  },
  notificationButton: {
    color: '#fff', 
    fontSize: 16, 
    marginRight: 20, 
    borderWidth:1,
    borderColor:'yellow',
    borderRadius:50,
    padding:3,
    paddingLeft:4,
    backgroundColor:'#fff',
  },
  notificationAlert: {
    backgroundColor: 'red',
  },
  backButton: {
    color: '#fff', 
    fontSize: 36, 
    marginLeft: 20, 
    marginBottom:15, 
    fontWeight: '700',
  }
});
