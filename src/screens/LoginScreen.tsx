import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../Hooks/UserContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { setUserInfo } = useContext(UserContext);

  async function login() {
    try {
      const response = await fetch('https://fiyasko-blog-api.vercel.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        navigation.navigate('Anasayfa');
      } else {
        Alert.alert('Hata', 'Hatalı kullanıcı adı veya şifre!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Bir hata oluştu.');
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={login} style={styles.button}>
        <Text style={styles.buttonText}>Giriş</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Kayit-ol')} style={styles.link}>
        <Text>Hesabın yok mu? <Text style={styles.linkText}>Yeni Hesap Oluştur</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});