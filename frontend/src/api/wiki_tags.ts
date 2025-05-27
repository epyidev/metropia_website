import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_URL}/api/wiki-tags`;

export const getAllTags = () => axios.get(`${API_URL}`);
export const createTag = (name: string, token: string) =>
  axios.post(`${API_URL}`, { name }, { headers: { Authorization: `Bearer ${token}` } });
export const assignTag = (page_id: string, tag_id: number, token: string) =>
  axios.post(`${API_URL}/assign`, { page_id, tag_id }, { headers: { Authorization: `Bearer ${token}` } });
export const removeTag = (page_id: string, tag_id: number, token: string) =>
  axios.post(`${API_URL}/remove`, { page_id, tag_id }, { headers: { Authorization: `Bearer ${token}` } });
export const getPagesByTag = (tag: string) => axios.get(`${API_URL}/${tag}`);
