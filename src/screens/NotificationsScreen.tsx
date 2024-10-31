import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { format } from 'date-fns';
import { id, tr } from 'date-fns/locale';
import { UserContext } from '../Hooks/UserContext';
import { useNavigation } from '@react-navigation/native';

export default function NotificationsScreen() {
  const { userInfo, setUserInfo, isDarkTheme } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('https://fiyasko-blog-api.vercel.app/profile', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      }
    };

    const fetchNotifications = async () => {
      if (userInfo?.id) {
        const response = await fetch(`https://fiyasko-blog-api.vercel.app/notifications/${userInfo.id}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error('Error fetching notifications.');
        }
      }
    };

    fetchProfile();
    fetchNotifications();
  }, [userInfo?.id]);

  // Mark all notifications as read
  useEffect(() => {
    if (userInfo?.id) {
      const markAllAsRead = async () => {
        const response = await fetch('https://fiyasko-blog-api.vercel.app/mark-all-notifications-as-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userInfo.id }),
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Failed to mark notifications as read.');
        }
      };
      markAllAsRead();
    }
  }, [userInfo?.id]);

  const formatDate = (dateString) => format(new Date(dateString), "HH:mm | dd MMMM yyyy", { locale: tr });

  const deleteNotification = async (notificationId) => {
    const response = await fetch(`https://fiyasko-blog-api.vercel.app/notifications/${userInfo.id}/${notificationId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.ok) {
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } else {
      Alert.alert('Error', 'Failed to delete notification.');
    }
  };

  const renderNotification = ({ item }) => {
    return (
      <View style={styles.notificationItem}>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { username: item.sender.username })}>
          <Image source={{ uri: item.sender.profilePhoto }} style={styles.profilePhoto} />
        </TouchableOpacity>
        <View style={styles.notificationContent}>
          <Text>
            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { username: item.sender.username })}>
              <Text style={styles.username}>@{item.sender.username}</Text>
            </TouchableOpacity>
            <Text style={[{color:'#fff'}, isDarkTheme ? null : styles.lightText]}> Kullanıcısı</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { id: item.post._id })}>
              <Text style={styles.postTitle}>"{item.post.title}"</Text>
              {/* <Text>{item.post._id}</Text> */}
            </TouchableOpacity>
            <Text style={[{color:'#fff'}, isDarkTheme ? null : styles.lightText]}>
            {item.type === 'like' && ' paylaşımını beğendi.'}
            {item.type === 'Yorum' && ' paylaşımına yorum yaptı.'}
            {item.type === 'Bahset' && ' paylaşımında senden bahsetti.'}
            </Text>
          </Text>
          <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
        </View>
        {/* <TouchableOpacity onPress={() => deleteNotification(item._id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.title, isDarkTheme ? null : styles.lightText]}>Bildirimler</Text>
      {notifications.length === 0 ? (
        <Text style={[styles.noNotifications, isDarkTheme ? null : styles.lightText]}>Bildiriminiz bulunmamaktadır.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.notificationsList}
        />
      )}
    </View>
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
      flex: 1,
      backgroundColor: '#f5f5f5',
      paddingTop: 20,
    },
    title: {
      fontSize: 24,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
      color: '#fff',
    },
    notificationsList: {
      paddingHorizontal: 20,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    profilePhoto: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    notificationContent: {
      flex: 1,
    },
    username: {
      fontWeight: 'bold',
      color: '#ff5555',
    },
    postTitle: {
      fontWeight: 'bold',
      color: '#518eff',
    },
    timestamp: {
      color: '#666',
      fontSize: 12,
      marginTop: 5,
    },
    deleteButton: {
      color: 'red',
      fontSize: 12,
      marginLeft: 10,
    },
    noNotifications: {
      textAlign: 'center',
      color: '#666',
      fontSize: 16,
      marginTop: 50,
    },
});
