import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Sesuaikan dengan backend
  withCredentials: true, // Untuk HTTP-only cookies
});

export default api;
