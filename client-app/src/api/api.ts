import {
    CreateMeasurementRequest,
    PressureMeasurementDto,
} from '@/shared/types/pressureMeasurements.types';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

export const PressureMeasurementService = {
    getAllWithDates: async (from: Date, till: Date) => {
        const response = await api.get<PressureMeasurementDto[]>(
            '/api/PressureMeasurement/withDates',
            {
                params: { from: from.toISOString(), till: till.toISOString() },
            }
        );
        return response.data;
    },

    getLatest: async () => {
        const response = await api.get<PressureMeasurementDto[]>(
            '/api/PressureMeasurement/latest'
        );
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<PressureMeasurementDto>(
            `/api/PressureMeasurement/${id}`
        );
        return response.data;
    },

    create: async (request: CreateMeasurementRequest) => {
        const response = await api.post<PressureMeasurementDto>(
            '/api/PressureMeasurement',
            request
        );
        return response.data;
    },

    update: async (id: number, request: PressureMeasurementDto) => {
        await api.put(`/api/PressureMeasurement/${id}`, request);
    },

    delete: async (id: number) => {
        await api.delete(`/api/PressureMeasurement/${id}`);
    },
};
export const FileService = {
    getXlsxLatest: async () => {
        const response = await api.get('/api/Reports/xlsxLatest', {
            responseType: 'blob',
        });
        return response.data;
    },

    getXlsxWithDates: async (from: Date, till: Date) => {
        const response = await api.get('/api/Reports/xlsxWithDates', {
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
