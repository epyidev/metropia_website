import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_URL}/api/wiki`;

export const getWikiPages = () => axios.get(`${API_URL}`);
export const getWikiPage = (id: string) => axios.get(`${API_URL}/${id}`);
export const createWikiPage = (title: string, content: string, token: string, id?: string) =>
  axios.post(`${API_URL}`, id ? { id, title, content } : { title, content }, { headers: { Authorization: `Bearer ${token}` } });
export const updateWikiPage = (id: string, title: string, content: string, token: string) =>
  axios.put(`${API_URL}/${id}`, { title, content }, { headers: { Authorization: `Bearer ${token}` } });
export const deleteWikiPage = (id: string, token: string) =>
  axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const searchWikiPages = (q: string) =>
  axios.get(`${API_URL}/search?q=${encodeURIComponent(q)}`);
export const getWikiHistory = (id: string) =>
  axios.get(`${API_URL}/${id}/history`);
export const restoreWikiHistory = (id: string, historyId: string, token: string) =>
  axios.post(`${API_URL}/${id}/restore/${historyId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
