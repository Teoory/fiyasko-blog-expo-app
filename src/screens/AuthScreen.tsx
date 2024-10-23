import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../Hooks/UserContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);  // Giriş/Kayıt formunu kontrol eden state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });
  const { setUserInfo } = useContext(UserContext);

  // Şifre doğrulama fonksiyonu
  const validatePassword = (value) => {
    setPasswordValidations({
      minLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasLowercase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
    });
  };

  const handleChangePassword = (value) => {
    setPassword(value);
    validatePassword(value);
  };

  // Giriş yap fonksiyonu
  const login = async () => {
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
        Alert.alert('Başarılı', 'Giriş başarılı!');
      } else {
        Alert.alert('Hata', 'Hatalı kullanıcı adı veya şifre!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Bir hata oluştu.');
    }
  };

  // Kayıt ol fonksiyonu
  const register = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor!');
      return;
    }
    if (!passwordValidations.minLength || !passwordValidations.hasUppercase || !passwordValidations.hasLowercase || !passwordValidations.hasNumber) {
      Alert.alert('Hata', 'Şifreniz geçerli değil!');
      return;
    }

    try {
      const response = await fetch('https://fiyasko-blog-api.vercel.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });
      if (response.ok) {
        Alert.alert('Başarılı', 'Kayıt başarılı!');
        setIsLogin(true);  // Başarılı kayıttan sonra giriş formuna döner
      } else {
        Alert.alert('Hata', 'Kayıt olurken bir hata oluştu!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      {isLogin ? (
        <>
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

          <TouchableOpacity onPress={() => setIsLogin(false)} style={styles.link}>
            <Text>Hesabın yok mu? <Text style={styles.linkText}>Yeni Hesap Oluştur</Text></Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Kayıt Ol</Text>

          <TextInput
            style={styles.input}
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
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
            onChangeText={handleChangePassword}
            secureTextEntry
          />
          {password !== '' && (
            <View style={styles.passwordValidations}>
              {!passwordValidations.minLength && <Text>Minimum 8 karakter olmalı</Text>}
              {!passwordValidations.hasUppercase && <Text>Bir büyük harf içermeli</Text>}
              {!passwordValidations.hasLowercase && <Text>Bir küçük harf içermeli</Text>}
              {!passwordValidations.hasNumber && <Text>Bir numara içermeli</Text>}
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Şifreyi Onayla"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {confirmPassword !== '' && password !== confirmPassword && (
            <Text style={styles.errorText}>Şifreler eşleşmiyor!</Text>
          )}

          <TouchableOpacity onPress={register} style={styles.button}>
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(true)} style={styles.link}>
            <Text>Zaten bir hesabın var mı? <Text style={styles.linkText}>Giriş Yap</Text></Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  passwordValidations: {
    marginBottom: 10,
  },
});