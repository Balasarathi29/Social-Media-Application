import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// User API
export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  follow: (id) => api.put(`/users/follow/${id}`),
  unfollow: (id) => api.put(`/users/unfollow/${id}`),
  getSuggested: () => api.get("/users/suggested"),
  search: (query) => api.get(`/users/search?query=${query}`),
};

// Post API
export const postAPI = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/posts?page=${page}&limit=${limit}`),
  getFeed: (page = 1, limit = 10) =>
    api.get(`/posts/feed?page=${page}&limit=${limit}`),
  getByUser: (userId, page = 1, limit = 10) =>
    api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`),
  getOne: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post("/posts", data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.put(`/posts/like/${id}`),
};

// Comment API
export const commentAPI = {
  getByPost: (postId) => api.get(`/comments/${postId}`),
  create: (postId, data) => api.post(`/comments/${postId}`, data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

export default api;
