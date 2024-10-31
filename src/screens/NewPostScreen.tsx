import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native'
import React, { useContext, useState } from 'react';
import { UserContext } from '../Hooks/UserContext';

export default function NewPostScreen() {
  const { userInfo, setUserInfo, toggleTheme, isDarkTheme } = useContext(UserContext);
  return (
    <View style={[styles.container, isDarkTheme ? styles.darkBackground : styles.lightBackground]}>
      <Animated.ScrollView>
        <View>
          <Text>New Post Screen</Text>
        </View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  darkBackground: {
    backgroundColor: '#181a1e',
  },
  lightBackground: {
    backgroundColor: '#f5f5f5',
  },
  lightText: {
    color: '#000',
  },
})