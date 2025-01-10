// src/services/api.ts

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {getItem} from "./storage";

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:9000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use(
    async (config) => {
        const token = await getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
