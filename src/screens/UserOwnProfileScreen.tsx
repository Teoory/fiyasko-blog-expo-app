import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { UserContext } from '../Hooks/UserContext';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function UserOwnProfileScreen() {
  const route = useRoute();
  const { userInfo, setUserInfo, isDarkTheme } = useContext(UserContext);
  const { username } = userInfo;
  const [userProfile, setUserProfile] = useState(null);
  const [files, setFiles] = useState('');
  const [bio, setBio] = useState('');
  const [editableBio, setEditableBio] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    fetch(`https://fiyasko-blog-api.vercel.app/profile/${username}`)
      .then(response => response.json()) 
      .then(data => {
        setUserProfile(data);
        setBio(data.user.bio);
      });
  }, [username]);


  useEffect(() => {
    fetch('https://fiyasko-blog-api.vercel.app/profile', { credentials: 'include' })
      .then(response => response.json())
      .then(userInfo => {
        setUserInfo(userInfo);
      });
    
    fetch(`https://fiyasko-blog-api.vercel.app/profile/${username}/likedPosts`)
      .then(response => response.json())
      .then(data => {
        setLikedPosts(data.likedPosts);
      });
  }, [username]);

  const newProfilePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('İzin Gerekli', 'Fotoğraf galerisine erişmek için izin vermeniz gerekiyor.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error("Token yok!");
        }
        
        const uploadResponse = await fetch('https://fiyasko-blog-api.vercel.app/mobileProfilePhoto', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (uploadResponse.ok) {
          Alert.alert('Başarılı', 'Profil fotoğrafı başarıyla güncellendi.');
          const updatedProfile = await uploadResponse.json();
          setUserProfile({ ...userProfile, user: { ...userProfile.user, profilePhoto: updatedProfile.profilePhoto } });
          setUserInfo({ ...userInfo, profilePhoto: updatedProfile.profilePhoto });
        } else {
          Alert.alert('Hata', 'Profil fotoğrafı güncellenemedi.');
        }
      } catch (error) {
        console.error('Fotoğraf yüklenirken hata oluştu:', error);
        Alert.alert('Hata', 'Fotoğraf yüklenirken bir hata oluştu.');
      }
    }
  };


  if (!userProfile) return <Text>Yükleniyor...</Text>;
  if (!username) {
    return <Text>Kullanıcı adı bulunamadı</Text>;
  }

  return (
    <ScrollView style={[styles.container, isDarkTheme ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={newProfilePhoto}>
          <Image source={{ uri: userProfile.user.profilePhoto }} style={styles.profilePhoto} />
        </TouchableOpacity>
        <View style={{ marginLeft: 20, textAlign: 'center',}}>
          {userProfile.user.username == 'teory'
          ? <Text style={styles.usernameTeory}>{userProfile.user.username}</Text>
          : <Text style={styles.username}>{userProfile.user.username}</Text>
          }

          <Text style={styles.email}>{userProfile.user.email}</Text>
        
          {userProfile.user.tags.includes("admin")
            ? <Text style={styles.tagsAdmin}>{userProfile.user.tags.join(', ')}</Text>
            : <Text style={styles.tags}>{userProfile.user.tags.join(', ')}</Text>
          }
        </View>
      </View>

      {/* Biyografi */}
      <View style={styles.bioArea}>
        <Text style={[styles.bioTitle, isDarkTheme ? null : styles.lightText]}>Biyografi</Text>

        {editableBio ? (
          <>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            multiline
          />
          </>
          
        ) : (
          <Text style={styles.bioText}>{bio || 'Henüz biyografi eklenmemiş.'}</Text>
        )}
      </View>

      {/* Kullanıcının Paylaşımları */}
      <View>
        <Text style={[styles.sectionTitle, isDarkTheme ? null : styles.lightText]}>{userProfile.user.username}'in Gönderileri:</Text>
        {userProfile.posts.length === 0 ? (
          <Text style={[styles.noPostsText, isDarkTheme ? null : styles.lightText]}>Bu kullanıcının henüz paylaşımı yok.</Text>
        ) : (
          userProfile.posts.map(post => (
            <View key={post._id} style={styles.postCard}>
              <Image source={{ uri: post.cover }} style={styles.postImage} />
              <Text style={[styles.postTitle, isDarkTheme ? null : styles.lightText]}>{post.title}</Text>
            </View>
          ))
        )}
      </View>

      {/* Beğenilen Gönderiler */}
      <View>
        <Text style={[styles.sectionTitle, isDarkTheme ? null : styles.lightText]}>{userProfile.user.username}'in Beğendiği Gönderiler:</Text>
        {likedPosts.length === 0 ? (
          <Text style={[styles.noPostsText, isDarkTheme ? null : styles.lightText]}>Henüz beğenilen bir gönderi yok.</Text>
        ) : (
          likedPosts.map(post => (
            <View key={post._id} style={styles.postCard}>
              <Image source={{ uri: post.cover }} style={styles.postImage} />
              <Text style={[styles.postTitle, isDarkTheme ? null : styles.lightText]}>{post.title}</Text>
            </View>
          ))
        )}
      </View>
      <View style={{paddingVertical:40}}></View>
    </ScrollView>
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
  container: {
    backgroundColor: '#181a1e',
    padding: 16,
    paddingTop: 40,
  },
  profileHeader: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
  },
  usernameTeory: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'red',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  tags: {
    textTransform:'uppercase',
    fontSize: 16,
    color: '#ddd999',
    marginTop: 5,
  },
  tagsAdmin: {
    textTransform:'uppercase',
    fontSize: 16,
    marginTop: 5,
    color: 'red',
  },
  bioArea: {
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'#fff',
    textDecorationLine: 'underline',
  },
  bioText: {
    fontSize: 16,
    color: '#ddd999',
    marginBottom: 10,
    backgroundColor: '#224',
    borderRadius: 10,
    padding: 10,
    minHeight: 300,
  },
  bioInput: {
    fontSize: 16,
    color: '#ddd999',
    borderColor: '#224',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 50,
    color:'#fff',
    textDecorationLine: 'underline',
    textTransform: 'capitalize',
  },
  postCard: {
    borderBottomColor: '#6a67ce',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingBottom: 15,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postTitle: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 5,
    color: '#fff',
    fontWeight: 'bold',
  },
  noPostsText: {
    fontSize: 16,
    color: '#999',
  },
});