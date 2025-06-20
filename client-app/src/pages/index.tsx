import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { PressureMeasurementService } from '@/api/api';
import PressureTable from '@/components/tables/PressureTable';

const PressureMeasurementPage: React.FC = () => {
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMeasurements();
    }, []);

    const loadMeasurements = async () => {
        try {
            setLoading(true);
            const data = await PressureMeasurementService.getLatest();

            setMeasurements(data);
        } catch (error) {
            console.error('Error loading measurements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMeasurement = async (newData: any) => {
        try {
            const { data } = await PressureMeasurementService.create(newData);
            setMeasurements((prev) => [data, ...prev]);
            return true;
        } catch (error) {
            console.error('Error adding measurement:', error);
            return false;
        }
    };

    const handleUpdateMeasurement = async (id: number, updatedData: any) => {
        try {
            await PressureMeasurementService.update(id, updatedData);
            setMeasurements((prev) =>
                prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m))
            );
            return true;
        } catch (error) {
            console.error('Error updating measurement:', error);
            return false;
        }
    };

    const handleDeleteMeasurement = async (id: number) => {
        try {
            await PressureMeasurementService.delete(id);
            setMeasurements((prev) => prev.filter((m) => m.id !== id));
            return true;
        } catch (error) {
            console.error('Error deleting measurement:', error);
            return false;
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Измерения давления
            </Typography>

            <PressureTable
                measurements={measurements}
                loading={loading}
                onAdd={handleAddMeasurement}
                onUpdate={handleUpdateMeasurement}
                onDelete={handleDeleteMeasurement}
                onRefresh={loadMeasurements}
            />
        </Box>
    );
};

export default PressureMeasurementPage;
