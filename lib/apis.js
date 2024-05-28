import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResizeMode } from "expo-av";

export const createUser = async (username, email, password) => {
  try {
    const response = await axios.post("http://192.168.157.67:8000/register", {
      username: username,
      email: email,
      password: password,
    });

    const login_res = await loginUser(email, password);
    return login_res;
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("http://192.168.157.67:8000/login", {
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async () => {
  try {
    let token = await AsyncStorage.getItem("jwt_token");
    const response = await axios.get(
      "http://192.168.157.67:8000/get-current-user",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (post) => {
  try {
    console.log("post :- ", post);
    const response = await axios.post(
      "http://192.168.157.67:8000/create-post",
      { post }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get(
      "http://192.168.157.67:8000/get-all-posts"
    );
    let posts = JSON.parse(response.data);
    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const response = await axios.get(
      "http://192.168.157.67:8000/get-latest-posts"
    );
    let posts = JSON.parse(response.data);
    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (email) => {
  try {
    const response = await axios.get(
      `http://192.168.157.67:8000/get-user-post?email=${email}`
    );
    let posts = JSON.parse(response.data);
    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const response = await axios.get(
      `http://192.168.157.67:8000/search_posts?query=${query}`
    );
    let posts = JSON.parse(response.data);
    return posts;
  } catch (error) {
    console.log(error.message);
  }
};
