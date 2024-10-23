import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Image, TouchableOpacity, Text, View, StyleSheet, } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PostDetail from '../screens/PostDetail';
import UserProfile from '../screens/UserProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Anasayfa"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#333',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      >
        {/* Anasayfa */}
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

        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
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