// SettingsScreen.tsx
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { UserContext } from '../Hooks/UserContext';

export default function SettingsScreen() {
  const { userInfo, setUserInfo, toggleTheme, isDarkTheme } = useContext(UserContext);

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Bu işlemi onaylıyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Evet", onPress: () => setUserInfo(null) }
      ]
    );
  };

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.title, isDarkTheme ? null : styles.lightText]}>Ayarlar</Text>
      <View style={styles.themeSwitch}>
        <Text style={[styles.themeText, isDarkTheme ? null : styles.lightText]}>Tema: {isDarkTheme ? 'Koyu' : 'Beyaz'}</Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} />
      </View>
      {userInfo && (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
  },
  themeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  themeText: {
    fontSize: 18,
    marginRight: 10,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff5555',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkBackground: {
    backgroundColor: '#333',
  },
  lightBackground: {
    backgroundColor: '#f5f5f5',
  },
});