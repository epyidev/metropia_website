import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const register = (username: string, email: string, password: string) =>
  axios.post(`${API_URL}/register`, { username, email, password });

export const login = (username: string, password: string) =>
  axios.post(`${API_URL}/login`, { username, password });
