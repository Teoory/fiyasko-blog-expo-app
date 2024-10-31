import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import { UserContext } from '../Hooks/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PostDetail() {
  const { userInfo, isDarkTheme } = useContext(UserContext); 
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [postInfo, setPostInfo] = useState(null);
  const [likes, setLikes] = useState(0);
  const [superlikes, setSuperLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSuperLiked, setHasSuperLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://fiyasko-blog-api.vercel.app/post/${id}`);
        setPostInfo(response.data);
      } catch (error) {
        console.info('Error fetching post details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // useEffect(() => {
  //   fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/likes`)
  //     .then(response => response.json())
  //     .then(data => {
  //       setLikes(data.likes);
  //   });

  //   fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/superlikes`)
  //     .then(response => response.json())
  //     .then(data => {
  //       setSuperLikes(data.superlikes);
  //   });

  //   fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/hasMobileLiked`,{
  //     method: 'GET',
  //     credentials: 'include',
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       setIsLiked(data.hasLiked);
  //   });

  //   fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/hasSuperLiked`,{
  //     method: 'GET',
  //     credentials: 'include',
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       setHasSuperLiked(data.hasSuperLiked);
  //   });

  //   fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/comments`)
  //     .then(response => response.json())
  //     .then(comments => setComments(comments))
  // }, [id]);

  useEffect(() => {
    const fetchLikesAndComments = async () => {
      try {
        const [likesData, superLikesData, hasLikedData, hasSuperLikedData, commentsData] = await Promise.all([
          fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/likes`).then(res => res.json()),
          fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/superlikes`).then(res => res.json()),
          fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/hasMobileLiked`, { method: 'GET', credentials: 'include' }).then(res => res.json()),
          fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/hasSuperLiked`, { method: 'GET', credentials: 'include' }).then(res => res.json()),
          fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/comments`).then(res => res.json())
        ]);

        setLikes(likesData.likes);
        setSuperLikes(superLikesData.superlikes);
        setIsLiked(hasLikedData.hasLiked);
        setHasSuperLiked(hasSuperLikedData.hasSuperLiked);
        setComments(commentsData);
      } catch (error) {
        console.info('Error fetching likes and comments:', error);
      }
    };

    fetchLikesAndComments();
  }, [id]);

  const sendNotification = async (senderId, receiverId, postId, type) => {
    try {
      const response = await fetch('https://fiyasko-blog-api.vercel.app/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, receiverId, postId, type }),
      });
      if (!response.ok) {
        console.info('Error sending notification');
      }
    } catch (error) {
      console.info('Error sending notification:', error);
    }
  };

  const addComment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error("Token yok!");

      const response = await fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/mobilecomment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const updatedComments = await fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/comments`).then(res => res.json());
      setComments(updatedComments);
      setNewComment('');

      const mentionedUsers = newComment.match(/@(\w+)/g);
      if (mentionedUsers) {
        await Promise.all(mentionedUsers.map(async username => {
          const receiverUser = await fetch(`https://fiyasko-blog-api.vercel.app/profile/${username.slice(1)}`).then(res => res.json());
          if (receiverUser && receiverUser.user._id !== userInfo.id) {
            await sendNotification(userInfo.id, receiverUser.user._id, postInfo._id, 'Bahset');
          }
        }));
      }

      if (userInfo.id !== postInfo.author._id) {
        await sendNotification(userInfo.id, postInfo.author._id, postInfo._id, 'Yorum');
      }
    } catch (error) {
      console.info('Error adding comment:', error.message);
    }
  };

  
  const toggleLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error("Token yok!");
      }
      
      const response = await fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/mobileLike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      setLikes(updatedData.likes);
      setIsLiked(updatedData.isLiked);
    } catch (error) {
      console.info('Error toggling like:', error.message);
    }
  };

  const toggleSuperLike = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error("Token yok!");
        }

        const response = await fetch(`https://fiyasko-blog-api.vercel.app/post/${id}/mobileSuperlike`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedData = await response.json();
        setSuperLikes(updatedData.superlikes);
        setHasSuperLiked(updatedData.isSuperLiked);

      } catch (error) {
        console.info('Error toggling superlike:', error.message);
      }
  };
  
  const formatDate = (dateString) => {
    const opt = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    };

    return new Date(dateString).toLocaleDateString('tr-TR', opt);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="orange" style={[{backgroundColor:'#f5f5f5', height:'100%'}, isDarkTheme ? styles.darkBackground : styles.lightBackground]} />;
  }

  if (!postInfo) {
    return <Text>Post bulunamadı.</Text>;
  }

  const { width } = Dimensions.get('window');
  
  return (
    <ScrollView style={[styles.container, isDarkTheme ? styles.darkBackground : styles.lightBackground]}>
      <Text style={[styles.title, isDarkTheme ? null : styles.lightText]}>{postInfo.title}</Text>
      <Text style={[styles.author, isDarkTheme ? null : styles.lightText]}>
        Yazar:
        <TouchableOpacity onPress={() => {
          // console.log("Navigasyona geçilen parametreler:", postInfo.author.username);
          navigation.navigate('UserProfile', { username: postInfo.author.username });
        }}>
          <Text style={[styles.author, { textDecorationLine: 'underline', color: '#fff', margin:3, top: 12 }, isDarkTheme ? null : styles.lightText]}>
          @{postInfo.author.username}
          </Text>
        </TouchableOpacity>
      </Text>
      <Text style={styles.time}>Yayınlanma Tarihi: {new Date(postInfo.createdAt).toLocaleDateString()}</Text>
      <View style={{display:'flex',flexDirection:'row',justifyContent:'center',marginBottom:15,}}>
        <Text style={[styles.totalviews, isDarkTheme ? null : styles.lightText]}>📖{postInfo.totalViews}</Text>
        <Text style={[styles.totalviews, isDarkTheme ? null : styles.lightText]}>😍{likes+superlikes}</Text>
      </View>
      <Image source={{ uri: postInfo.cover }} style={styles.image} />

      <View style={styles.content}>
        <RenderHtml
          contentWidth={width}
          source={{ html: postInfo.content }}
          tagsStyles={{
            p: { fontSize: 16, color: `${isDarkTheme ? '#fff' : styles.lightText}`, lineHeight: 24 },
            li: { color: `${isDarkTheme ? '#fff' : styles.lightText}` },
            img: { width: '100%', height: 200, objectFit: 'cover', borderRadius: 10 },
            blockquote: { backgroundColor: '#00071c', padding: 10, fontStyle: 'italic' },
            pre: {color:'#fff', backgroundColor: '#00071c', padding: 10, fontStyle: 'italic'},
            a: {color:'#000', backgroundColor: '#ff5555', textDecorationLine:'underline', fontStyle: 'italic', padding: 10},
            h1: {color: `${isDarkTheme ? '#fff' : styles.lightText}`,},
            h2: {color: `${isDarkTheme ? '#fff' : styles.lightText}`,},
            h3: {color: `${isDarkTheme ? '#fff' : styles.lightText}`,},
            h4: {color: `${isDarkTheme ? '#fff' : styles.lightText}`,},
          }}
        />
      </View>


      <View style={styles.likesArea}>
        <View style={styles.likeButtons}>
          <View>
            <Text style={[styles.likesCount, isDarkTheme ? null : styles.lightText]}>{likes}</Text>
            {userInfo !== null
            ? <TouchableOpacity onPress={toggleLike}>
                {isLiked ? <Text style={styles.likedButton}>❤️</Text> : <Text style={styles.likeButton}>🤍</Text>}
              </TouchableOpacity>
            : <Text style={styles.likeButton}>🤍</Text>
            }
          </View>

          <View>
            <Text style={[styles.likesCount, isDarkTheme ? null : styles.lightText]}>{superlikes}</Text>
            {userInfo !== null
            ? <TouchableOpacity onPress={toggleSuperLike}>
                {isSuperLiked ? <Text style={styles.likedButton}>👻</Text> : <Text style={styles.likeButton}>👻</Text>}
              </TouchableOpacity>
            : <Text style={styles.likeButton}>👻</Text>
            }
          </View>
        </View>
        {userInfo === null && <Text style={{color:'red',fontSize:24,fontWeight:700,paddingBottom:10,textDecorationLine:'underline',textAlign:'center'}}>Beğenmek için giriş yapınız!</Text>}
      </View>

      <View style={styles.commentsArea}>
        <View>
            <Text style={[{color:'#fff', fontSize:32, fontWeight:700, textDecorationLine:'underline',}, isDarkTheme ? null : styles.lightText]}>Yorumlar: </Text>
            {comments.length === 0 
              ? <Text style={[{color:'#b37024'}, isDarkTheme ? null : styles.lightText]}>İlk yorumu siz yapın!</Text>
              : <Text style={styles.commentsCount}>{comments.length}</Text>
            }
        </View>

        {userInfo !== null 
          ? <View>
              <TextInput
                style={styles.newComment}
                placeholder="Yorumunuzu yazın..."
                value={newComment}
                onChangeText={setNewComment}
                maxLength={256}
              />
              <TouchableOpacity onPress={addComment} style={styles.commentButton}>
                <Text style={styles.commentButtonText}>Yorum Yap</Text>
              </TouchableOpacity>
            </View>
          : <Text style={[{color:'red',fontSize:24,fontWeight:700,paddingBottom:10,textDecorationLine:'underline',textAlign:'center'}]}>Yorum yapmak için giriş yapınız!</Text>
        }

        {comments.length === 0
        ? <Text style={{color:'#fff',fontSize:32,fontWeight:800,}}>Buralar biraz sessiz!</Text>
        : <View>
            {comments.map(comment => (
              <View>
                <View style={styles.comment}>
                  <View style={styles.commentInfo}>
                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',gap:5,}}>
                      <TouchableOpacity onPress={() => {
                          navigation.navigate('UserProfile', { username: comment.author.username });
                        }}>
                        <Image source={{ uri: comment.author.profilePhoto }} style={styles.profilePhoto} />
                      </TouchableOpacity>

                      <Text style={{color:'#696969',fontSize:12, alignItems:'center',justifyContent:'center'}}>
                        Yazar:
                        <TouchableOpacity onPress={() => {
                          navigation.navigate('UserProfile', { username: comment.author.username });
                        }}>
                          <Text style={{textDecorationLine:'none', color:'#2f2fc4',fontWeight:'700', fontSize:16,}}>
                            @{comment.author.username}
                          </Text>
                        </TouchableOpacity>
                      </Text>
                    </View>
                    <Text style={{color:'#696969',marginLeft:10,fontSize:12,}}>| {formatDate(comment.createdAt)}</Text>
                  </View>

                  <Text>{comment.content}</Text>
                </View>
              </View>
            ))}
          </View>
        }
      </View>
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
    padding: 16,
    backgroundColor: '#181a1e',
    paddingBottom: 150,
  },
  totalviews: {
    color: '#fff',
    borderRadius: 5,
    marginRight: 5,
    paddingHorizontal: 2,
    paddingVertical: 6,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    width: 60,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  author: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '700',
    margin: 0,
  },
  time: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  likesArea: {
    marginBottom:10,
    padding:10,
  },
  likeButtons: {
    borderTopWidth:3,
    borderTopColor:'#fff',
    alignItems:'center',
    flexDirection:'row',
    gap:10,
    justifyContent:'center',
  },
  likesCount: {
    textAlign:'center',
    color:'#fff',
    fontSize:20,
  },
  likeButton: {
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
    padding: 5,
    backgroundColor: '#00071c',
    borderRadius: 10,
  },
  likedButton: {
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
    padding: 5,
    backgroundColor: '#b37024',
    borderRadius: 10,
  },
  commentsArea: {
    marginBottom:10,
    padding:10,
  },
  commentsCount: {
    borderWidth:1,
    borderStyle: 'solid',
    borderRadius: 100,
    fontSize: 14,
    marginLeft: 150,
    marginTop: 13,
    paddingHorizontal:6,
    paddingVertical:1,
    textAlign:'center',
    color:'#ff8c00',
    borderColor:'#ff8c00',
    position:'absolute',
  },
  comment: {
    backgroundColor:'#ddd',
    borderWidth:1,
    borderColor:'6a67ce',
    borderRadius:5,
    color:'#000',
    marginBottom:10,
    padding:10,
  },
  commentInfo: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    borderBottomWidth:1,
    borderBottomColor:'#696969',
    marginBottom:5,
    paddingBottom:5,
  },
  profilePhoto: {
    width:30,
    height:30,
    borderRadius: 100,
    borderWidth:1,
    borderColor:'#555',
  },
  newComment: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    color: '#000',
    textAlignVertical: 'top',
  },
  commentButton: {
    backgroundColor: '#518eff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    marginTop: 10,
  },
});