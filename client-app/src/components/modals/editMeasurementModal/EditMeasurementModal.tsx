import React from 'react';

import { PressureMeasurementResponse } from '@/types/types';

interface EditMeasurementModalProps {
    open: boolean;
    onClose: () => void;
    measurement: PressureMeasurementResponse | null;
    onSubmit: (
        id: number,
        data: Partial<PressureMeasurementResponse>
    ) => Promise<boolean>;
}

const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
    onClose,
    measurement,
    onSubmit,
}) => {
    const [editedMeasurement, setEditedMeasurement] =
        React.useState<Partial<PressureMeasurementResponse> | null>(null);

    React.useEffect(() => {
        if (measurement) {
            setEditedMeasurement({ ...measurement });
        }
    }, [measurement]);

    const handleChange = (
        field: keyof PressureMeasurementResponse,
        value: any
    ) => {
        if (editedMeasurement) {
            setEditedMeasurement({ ...editedMeasurement, [field]: value });
        }
    };

    const handleSubmit = async () => {
        if (editedMeasurement && measurement) {
            const success = await onSubmit(measurement.Id, editedMeasurement);
            if (success) {
                onClose();
            }
        }
    };

    if (!editedMeasurement) return null;

    return <></>;
};

export default EditMeasurementModal;
