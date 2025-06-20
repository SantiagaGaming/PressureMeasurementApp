import { CreateMeasurementRequest, PressureMeasurementResponse, UpdateMeasurementRequest } from '@/types/types';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const PressureMeasurementService = {
  getAllWithDates: async (from: Date, till: Date) => {
    const response = await api.get<PressureMeasurementResponse[]>('/PressureMeasurement/withDates', {
      params: { from: from.toISOString(), till: till.toISOString() },
    });
    return response.data;
  },

  getLatest: async () => {
    const response = await api.get<PressureMeasurementResponse[]>('/PressureMeasurement/latest');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<PressureMeasurementResponse>(`/PressureMeasurement/${id}`);
    return response.data;
  },

  create: async (request: CreateMeasurementRequest) => {
    const response = await api.post<PressureMeasurementResponse>('/PressureMeasurement', request);
    return response.data;
  },

  update: async (id: number, request: UpdateMeasurementRequest) => {
    await api.put(`/PressureMeasurement/${id}`, request);
  },

  delete: async (id: number) => {
    await api.delete(`/PressureMeasurement/${id}`);
  },
};