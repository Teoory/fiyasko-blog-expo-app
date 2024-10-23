import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Keyboard, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PostDetail from '../screens/PostDetail';
import UserProfile from '../screens/UserProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import LoginScreen from '../screens/LoginScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#333',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      {/* Ana sayfa */}
      <Stack.Screen 
        name="Anasayfa" 
        component={HomeScreen} 
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
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.notificationButton}>🔔</Text>
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
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.notificationButton}>🔔</Text>
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
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.notificationButton}>🔔</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Anasayfa"
      activeColor="#fff"
      inactiveColor="#ccc"
      barStyle={{ backgroundColor: '#333' }}
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

      <Tab.Screen 
        name="Giriş Yap" 
        component={LoginScreen}
        options={{
          tabBarLabel: 'Giriş Yap',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="login" color={color} size={24} />
          ),
        }}
      />
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
      <BottomTabNavigator />
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
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
  backButton: {
    color: '#fff', 
    fontSize: 36, 
    marginLeft: 20, 
    marginBottom:15, 
    fontWeight: '700',
  }
});
