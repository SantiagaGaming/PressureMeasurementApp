import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { PressureMeasurementDto } from '@/shared/types/pressureMeasurements.types';

interface UsePressureMeasurementHubProps {
    onMeasurementAdded?: (measurement: PressureMeasurementDto) => void;
    onMeasurementUpdated?: (measurement: PressureMeasurementDto) => void;
    onMeasurementDeleted?: (id: number) => void;
}

const usePressureMeasurementHub = ({
    onMeasurementAdded,
    onMeasurementUpdated,
    onMeasurementDeleted,
}: UsePressureMeasurementHubProps) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/pressureMeasurementHub`)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    connection.invoke('SubscribeToUpdates');
                    
                    if (onMeasurementAdded) {
                        connection.on('MeasurementAdded', onMeasurementAdded);
                    }
                    
                    if (onMeasurementUpdated) {
                        connection.on('MeasurementUpdated', onMeasurementUpdated);
                    }
                    
                    if (onMeasurementDeleted) {
                        connection.on('MeasurementDeleted', onMeasurementDeleted);
                    }
                })
                .catch(console.error);

            return () => {
                if (connection) {
                    connection.invoke('UnsubscribeFromUpdates');
                    connection.off('MeasurementAdded');
                    connection.off('MeasurementUpdated');
                    connection.off('MeasurementDeleted');
                }
            };
        }
    }, [connection, onMeasurementAdded, onMeasurementUpdated, onMeasurementDeleted]);

    return { connection };
};

export default usePressureMeasurementHub;