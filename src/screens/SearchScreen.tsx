import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const [searchResults, setSearchResults] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [minSearchResults, setMinSearchResults] = useState(0);
  const [maxSearchResults, setMaxSearchResults] = useState(10);
  const navigation = useNavigation();

  const handleSearch = async (keyword: string) => {
    try {
      const response = await axios.get(`https://fiyasko-blog-api.vercel.app/search/${keyword}`);
      if (response.status === 200) {
        setSearchResults(response.data);
      } else {
        console.error('Error searching:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching:', error.message);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const performRandomSearch = () => {
    const keywords = ['Front', 'React'];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    handleSearch(randomKeyword);
  };

  const handleSearchSubmit = () => {
    if (!keyword.trim()) {
      Alert.alert('Uyarı', `Lütfen arama yapmak için bir veri girin.`, [
        { text: 'Tamam', style: 'default' },
      ]);
      performRandomSearch();
    } else {
      handleSearch(keyword);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Aramak istediğiniz kelimeyi yazın..."
        value={keyword}
        onChangeText={text => setKeyword(text)}
        onSubmitEditing={handleSearchSubmit}
      />

      <ScrollView>
        {searchResults.slice(minSearchResults, maxSearchResults).map((result) => (
          <TouchableOpacity
            key={result._id}
            style={styles.post}
            onPress={() => navigation.navigate('PostDetail', { id: result._id })}
          >
            <Image source={{ uri: result.cover }} style={styles.postImage} />
            <View style={styles.textContainer}>
              <Text style={styles.postTitle}>{truncateText(result.title, 20)}</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.postTags}>{result.PostTags}</Text>
                <Text style={styles.time}>{new Date(result.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.summary}>{truncateText(result.summary, 40)}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {/* Sayfa geçiş butonları */}
        {searchResults.length > 2 && (
          <View>
            <Text style={styles.paginationInfo}>
              Görüntülenen paylaşımlar: {minSearchResults + searchResults.length} / {maxSearchResults}
            </Text>
            <View style={styles.paginationButtons}>
              {minSearchResults > 0 && (
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => {
                    setMinSearchResults(minSearchResults - 10);
                    setMaxSearchResults(maxSearchResults - 10);
                  }}
                >
                  <Text>◀️ Önceki Sayfa</Text>
                </TouchableOpacity>
              )}
              {maxSearchResults < searchResults.length && (
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => {
                    setMaxSearchResults(maxSearchResults + 10);
                    setMinSearchResults(minSearchResults + 10);
                  }}
                >
                  <Text>Sonraki Sayfa ▶️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#181a1e',
  },
  searchBox: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: '#333',
  },
  post: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#2c2f33',
    padding: 10,
    borderRadius: 10,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  postTags: {
    color: '#333',
    fontSize: 12,
    marginBottom: 5,
    backgroundColor: '#ffc107',
    width: 80,
    textAlign: 'center',
    borderRadius: 5,
    fontWeight: 'bold',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
  },
  author: {
    color: '#2f2fff',
    fontSize: 12,
  },
  time: {
    color: '#777',
    fontSize: 12,
  },
  summary: {
    color: '#ccc',
    fontSize: 14,
  },
  paginationInfo: {
    color: '#ccc',
    textAlign: 'center',
    marginVertical: 10,
  },
  paginationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#518eff',
    borderRadius: 5,
  },
});