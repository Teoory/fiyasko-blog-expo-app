import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { UserContext } from '../Hooks/UserContext';
import { useRoute } from '@react-navigation/native';

export default function UserProfileScreen() {
  const route = useRoute();
  const { username } = route.params;
  const [userProfile, setUserProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [editableBio, setEditableBio] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const { userInfo, setUserInfo, isDarkTheme } = useContext(UserContext);

  // useEffect(() => {
  //   console.log("Alınan parametreler:", route.params);
  // }, [route.params]);



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://fiyasko-blog-api.vercel.app/profile/${username}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setUserProfile(data);
        setBio(data.user.bio);
      } catch (error) {
        console.info("UserProfile fetch error:", error);
      }
    };
  
    fetchUserProfile();
  }, [username]);
  
  useEffect(() => {
    const fetchUserInfoAndLikedPosts = async () => {
      try {
        const userInfoResponse = await fetch('https://fiyasko-blog-api.vercel.app/mobileProfile', { credentials: 'include' });
        if (userInfoResponse.ok) {
          const userInfoData = await userInfoResponse.json();
          setUserInfo(userInfoData);
        } else {
          console.info('User info fetch failed:', userInfoResponse.status);
        }
  
        const likedPostsResponse = await fetch(`https://fiyasko-blog-api.vercel.app/profile/${username}/likedPosts`);
        if (likedPostsResponse.ok) {
          const likedPostsData = await likedPostsResponse.json();
          setLikedPosts(likedPostsData.likedPosts);
        } else {
          console.info('Liked posts fetch failed:', likedPostsResponse.status);
        }
      } catch (error) {
        console.info("Error fetching user info and liked posts:", error);
      }
    };
  
    fetchUserInfoAndLikedPosts();
  }, [username]);

  if (!userProfile) return <ActivityIndicator size="large" color="orange" style={[{backgroundColor:'#f5f5f5', height:'100%'}, isDarkTheme ? styles.darkBackground : styles.lightBackground]} />;
  if (!username) {
    return <Text>Kullanıcı adı bulunamadı</Text>;
  }

  return (
    <ScrollView style={[styles.container, isDarkTheme ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: userProfile.user.profilePhoto }} style={styles.profilePhoto} />
        <View style={{ marginLeft: 20, alignItems: 'center',}}>
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

      <View style={styles.bioArea}>
        <Text style={[styles.bioTitle, isDarkTheme ? null : styles.lightText]}>Biyografi</Text>

        {editableBio ? (
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            multiline
          />
        ) : (
          <Text style={styles.bioText}>{bio || 'Henüz biyografi eklenmemiş.'}</Text>
        )}
      </View>

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
      <View style={{paddingVertical:20}}></View>
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