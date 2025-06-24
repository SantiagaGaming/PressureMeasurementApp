'use client';
import React, { useState, useEffect } from 'react';
import { PressureMeasurementService } from '@/api/api';
import {
    CreateMeasurementRequest,
    PressureMeasurementDto,
} from '@/shared/types/pressureMeasurements.types';
import Index from './Index';
import { toast } from 'react-toastify';

const PressureMeasurementPage = () => {
    const [measurements, setMeasurements] = useState<PressureMeasurementDto[]>(
        []
    );
    const [measurement, setMeasurement] =
        useState<PressureMeasurementDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('measureDate');
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        loadMeasurements();
    }, [currentPage, sortField, sortDirection]);

    const loadMeasurements = async () => {
        try {
            setLoading(true);
            const response = await PressureMeasurementService.getLatest();
            setMeasurements(response);
            setMeasurement(null);
        } catch (error) {
            toast.error(error);
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
    ) => {
        try {
            setLoading(true);
            const response =
                await PressureMeasurementService.create(measurement);
            setMeasurements((prev) => [response, ...prev]);
            toast.success('New measurement added!');
        } catch (error) {
            toast.error(error);
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
            toast.success('Measurement deleted!');
        } catch (error) {
            toast.error(`Error deleting measurement: ${error}`);
        } finally {
            setLoading(false);
        }
    };
    const handleGetMeasuremenById = async (id: number) => {
        try {
            setLoading(true);
            const result = await PressureMeasurementService.getById(id);
            setMeasurement(result);
        } catch (error) {
            toast.error(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };
    const handleUpdateMeasurement = async (
        id: number,
        data: PressureMeasurementDto
    ) => {
        try {
            setLoading(true);
            const result = await PressureMeasurementService.update(id, data);
            await loadMeasurements();
            toast.success('Measurement updated!');
        } catch (error) {
            toast.error(`Error: ${error}`);
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
        />
    );
};

export default PressureMeasurementPage;
