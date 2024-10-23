import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { tr, eu } from 'date-fns/locale';
import { getPosts } from '../constant/Fetch';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const locales = { tr, eu };
  

  useEffect(() => {
    async function fetchPosts() {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    }
    fetchPosts();
  }, []);


  return (
    <View style={styles.container}>
      <Animated.ScrollView>
        <Text style={styles.headerText}>Son Gönderiler</Text>
        {posts.map((post) => (
          <TouchableOpacity
            key={post._id}
            onPress={() => navigation.navigate('PostDetail', { id: post._id })}
          >
            <View style={styles.postContainer}>
              <View style={styles.postImageArea}>
                <Image source={{ uri: post.cover }} style={styles.postImage} />
              </View>
              <View style={{ margin: 5 }}>
                <Text style={styles.postTag}>{post.PostTags}</Text>
                <Text style={styles.title}>{post.title}</Text>
                <View style={styles.postinfo}>
                  <TouchableOpacity onPress={() => {
                          navigation.navigate('UserProfile', { username: post.author.username });
                        }}>
                          <Text style={{ color: '#2f2fff' }}>{post.author.username}</Text>
                        </TouchableOpacity>
                  <Text style={styles.postTime}>
                    {format(new Date(post.createdAt), "HH:MM | dd MMMM yyyy", {
                      locale: locales["tr"],
                    })}
                  </Text>
                </View>
                <View style={styles.postDownArea}>
                  <Text style={styles.summary}>
                    <Text style={styles.firstLetter}>{post.summary.charAt(0)}</Text>
                    <Text>{post.summary.slice(1)}...</Text>
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181a1e',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    margin: 20,
    paddingBottom: 15,
    marginTop: 30,
    borderBottomColor: '#ffff00',
    borderBottomWidth: 2,
    textAlign: 'center',
  },
  postContainer: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#6a67ce',
    paddingBottom: 15,
    marginBottom: 15,
    gap: 20,
  },
  postImage: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 300,
    width: '100%',
    objectFit: 'cover',
  },
  postTag: {
    backgroundColor: '#ffc107',
    borderRadius: 5,
    color: '#000',
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 10,
    width: '20%',
    textAlign: 'center',
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  postinfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 5,
  },
  postTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#696969',
  },
  summary: {
    lineHeight: 22,
    margin: 0,
    color: '#fff',
  },
  firstLetter: {
    color: 'gold',
    textTransform: 'uppercase',
    fontSize: 24,
    fontWeight: '600',
  },
});