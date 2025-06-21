
'use client'
import React, { useState, useEffect } from 'react';
import { PressureMeasurementService } from '@/api/api';
import PressureTable from '@/components/tables/PressureTable';
import { PressureMeasurementResponse } from '@/types/types';
import AppContent from '@/pages/AppContent';
const PressureMeasurementPage = () => {
    const [measurements, setMeasurements] = useState<PressureMeasurementResponse[]>([]);
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

        } catch (error) {
            console.error('Error loading measurements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        await loadMeasurements();
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

   return (
        <AppContent>
            <div className="content-header">
            </div>
            <PressureTable
                measurements={measurements}
                loading={loading}
                onRefresh={handleRefresh}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onSort={handleSort}
            />
        </AppContent>
    );
};
export default PressureMeasurementPage