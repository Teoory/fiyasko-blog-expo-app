import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Image, TouchableOpacity, Text, View, StyleSheet, } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PostDetail from '../screens/PostDetail';
import UserProfile from '../screens/UserProfileScreen';

const Stack = createStackNavigator();

export default function BottomNavigator() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.emoji}>🏠</Text>
          <Text style={styles.emojiText}>Anasayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button, {borderLeftWidth:1,borderRightWidth:1,width:'33%',alignItems: 'center',borderColor:'#222',}}>
          <Text style={styles.emoji}>🔍</Text>
          <Text style={styles.emojiText}>Arama</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.emoji}>👤</Text>
          <Text style={styles.emojiText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  button: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  emojiText: {
    color:'#fff',
    fontSize: 8,
  }
});