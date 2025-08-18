import {
    CreateMeasurementRequest,
    PressureMeasurementDto,
} from '@/shared/types/pressureMeasurements.types';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const PressureMeasurementService = {
    getAllWithDates: async (from: Date, till: Date) => {
        const response = await api.get<PressureMeasurementDto[]>(
            '/measurements/api/PressureMeasurement/withDates',
            {
                params: { from: from.toISOString(), till: till.toISOString() },
            }
        );
        return response.data;
    },

    getLatest: async () => {
        const response = await api.get<PressureMeasurementDto[]>(
            '/measurements/api/PressureMeasurement/latest'
        );
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<PressureMeasurementDto>(
            `/measurements/api/PressureMeasurement/${id}`
        );
        return response.data;
    },

    create: async (request: CreateMeasurementRequest) => {
        const response = await api.post<PressureMeasurementDto>(
            '/measurements/api/PressureMeasurement',
            request
        );
        return response.data;
    },

    update: async (id: number, request: PressureMeasurementDto) => {
        await api.put(`/measurements/api/PressureMeasurement/${id}`, request);
    },

    delete: async (id: number) => {
        await api.delete(`/measurements/api/PressureMeasurement/${id}`);
    },
};

export const FileService = {
    getXlsxLatest: async () => {
        const response = await api.get('/measurements/api/Reports/xlsxLatest', {
            responseType: 'blob',
        });
        return response.data;
    },

    getXlsxWithDates: async (from: Date, till: Date) => {
        const response = await api.get('/measurements/api/Reports/xlsxWithDates', {
            params: { from: from.toISOString(), till: till.toISOString() },
            responseType: 'blob',
        });
        return response.data;
    },

    downloadFile: (blob: Blob, fileName: string) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },
};
