import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/shared/types/auth.types';

const API_BASE_URL =  'http://localhost:8080';

const authApi = axios.create({
    baseURL: API_BASE_URL,
});

export const AuthService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await authApi.post<AuthResponse>('/auth/api/login', credentials);
        return response.data;
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
           console.log(userData)
        const response = await authApi.post<AuthResponse>('/auth/api/register', userData);
     
        return response.data;
    },

    logout: async (token: string): Promise<void> => {
        await authApi.post('/auth/logout', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    validateToken: async (token: string): Promise<{ valid: boolean }> => {
        const response = await authApi.get<{ valid: boolean }>('/auth/auth/validate', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
