'use client';
import React, { useState, useEffect } from 'react';
import { FileService, PressureMeasurementService } from '@/api/api';
import {
    CreateMeasurementRequest,
    PressureMeasurementDto,
} from '@/shared/types/pressureMeasurements.types';
import Index from './Index';
import { toast } from 'react-toastify';

const IndexPage = () => {
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
    const handleGetMeasurementsWithDates = async (
        from: Date | null,
        till: Date | null
    ) => {
        if (from == null || till == null) {
            toast.error('Dates must be filled!');
            return;
        }
        try {
            setLoading(true);
            const response = await PressureMeasurementService.getAllWithDates(
                from,
                till
            );
            setMeasurements(response);
            toast.success('Measurement uploaded!');
        } catch (error) {
            toast.error(`Error: ${error}`);
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
                fileName = `report.xlsx`;
            } else {
                blob = await FileService.getXlsxLatest();
                fileName = 'latest_report.xlsx';
            }

            FileService.downloadFile(blob, fileName);
            toast.success('Report downloaded successfully!');
        } catch (error) {
            toast.error(`Error downloading report: ${error}`);
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
