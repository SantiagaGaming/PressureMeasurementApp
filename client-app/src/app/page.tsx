'use client';
import React, { useState, useEffect } from 'react';
import { FileService, PressureMeasurementService } from '@/api/api';
import {
    CreateMeasurementRequest,
    PressureMeasurementDto,
} from '@/shared/types/pressureMeasurements.types';
import Index from './index/Index';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const IndexPage = () => {
    const [measurements, setMeasurements] = useState<PressureMeasurementDto[]>([]);
    const [measurement, setMeasurement] = useState<PressureMeasurementDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('measureDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const router = useRouter();

    useEffect(() => {
        loadMeasurements();
    }, [currentPage, sortField, sortDirection]);

    const loadMeasurements = async () => {
        try {
            setLoading(true);
            const response = await PressureMeasurementService.getLatest();
            setMeasurements(response);
            setMeasurement(null);
            setTotalPages(Math.max(1, Math.ceil(response.length / 10)));
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/auth');
                return;
            }
            toast.error(error.message || 'Ошибка загрузки измерений');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSort = (sortKey: string) => {
        if (sortField === sortKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(sortKey);
            setSortDirection('asc');
        }
    };

    const handleAddMeasurement = async (
        measurement: CreateMeasurementRequest
    ): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await PressureMeasurementService.create(measurement);
            setMeasurements((prev) => [response, ...prev]);
            toast.success('Новое измерение добавлено!');
            return true;
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/auth');
                return false;
            }
            toast.error(error.message || 'Ошибка добавления измерения');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMeasurement = async (id: number) => {
        try {
            setLoading(true);
            await PressureMeasurementService.delete(id);
            setMeasurements((prev) =>
                prev.filter((measurement) => measurement.id !== id)
            );
            toast.success('Измерение удалено!');
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/auth');
                return;
            }
            toast.error(`Ошибка удаления измерения: ${error.message || 'Неизвестная ошибка'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGetMeasuremenById = async (id: number) => {
        try {
            setLoading(true);
            const result = await PressureMeasurementService.getById(id);
            setMeasurement(result);
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/auth');
                return;
            }
            toast.error(`Ошибка: ${error.message || 'Неизвестная ошибка'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMeasurement = async (
        id: number,
        data: PressureMeasurementDto
    ): Promise<boolean> => {
        try {
            setLoading(true);
            await PressureMeasurementService.update(id, data);
            await loadMeasurements();
            toast.success('Измерение обновлено!');
            return true;
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/auth');
                return false;
            }
            toast.error(`Ошибка: ${error.message || 'Неизвестная ошибка'}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleGetMeasurementsWithDates = async (
        from: Date | null,
        till: Date | null
    ) => {
        if (from == null || till == null) {
            toast.error('Даты должны быть заполнены!');
            return;
        }
        try {
            setLoading(true);
            const response = await PressureMeasurementService.getAllWithDates(from, till);
            setMeasurements(response);
            setTotalPages(Math.max(1, Math.ceil(response.length / 10)));
            toast.success('Измерения загружены!');
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/auth');
                return;
            }
            toast.error(`Ошибка: ${error.message || 'Неизвестная ошибка'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (from: Date | null, till: Date | null) => {
        try {
            setLoading(true);
            let blob: Blob;
            let fileName: string;

            if (from && till) {
                blob = await FileService.getXlsxWithDates(from, till);
                fileName = `report_${from.toISOString().split('T')[0]}_${till.toISOString().split('T')[0]}.xlsx`;
            } else {
                blob = await FileService.getXlsxLatest();
                fileName = 'latest_report.xlsx';
            }

            FileService.downloadFile(blob, fileName);
            toast.success('Отчет успешно загружен!');
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/auth');
                return;
            }
            toast.error(`Ошибка загрузки отчета: ${error.message || 'Неизвестная ошибка'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Index
            measurements={measurements}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSort={handleSort}
            onAdd={handleAddMeasurement}
            onDelete={handleDeleteMeasurement}
            onGet={handleGetMeasuremenById}
            onUpdate={handleUpdateMeasurement}
            measurement={measurement}
            onGetWithDates={handleGetMeasurementsWithDates}
            onExport={handleExport}
        />
    );
};

export default IndexPage;
