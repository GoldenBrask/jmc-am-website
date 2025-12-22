import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // Important for cookies/sessions
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
