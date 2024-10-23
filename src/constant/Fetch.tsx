import axios from 'axios';

const API_URL = 'https://fiyasko-blog-api.vercel.app';

export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/post`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

export const getPostById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/post/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
};