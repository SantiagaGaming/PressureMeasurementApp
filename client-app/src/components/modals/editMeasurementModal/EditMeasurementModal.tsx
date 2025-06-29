import React, { useState, useEffect } from 'react';
import styles from './EditMeasurementModal.module.css';
import TextButton from '@/components/ui/buttons/textButton/TextButton';
import Image from 'next/image';
import { close } from '@/utils/constants';
import Checkbox from '@/components/ui/inputs/checkBox/CheckBox';
import { PressureMeasurementDto } from '@/shared/types/pressureMeasurements.types';
import { toast } from 'react-toastify';

interface EditMeasurementModalProps {
    open: boolean;
    onClose: () => void;
    measurement?: PressureMeasurementDto | null;
    onSubmit: (id: number, data: PressureMeasurementDto) => Promise<boolean>;
}

interface CheckboxItem {
    field: keyof PressureMeasurementDto;
    label: string;
    id: string;
}

const EditMeasurementModal = ({
    open,
    onClose,
    measurement,
    onSubmit,
}: EditMeasurementModalProps) => {
    const defaultMeasurement: PressureMeasurementDto = {
        id: 0,
        upperPressure: 0,
        lowerPressure: 0,
        heartbeat: 0,
        description: '',
        measureDate: new Date(),
        smoking: false,
        alcohol: false,
        sport: false,
        stretching: false,
        pressureState: undefined,
    };

    const [editedMeasurement, setEditedMeasurement] = 
        useState<PressureMeasurementDto>(defaultMeasurement);

    const checkboxItems: CheckboxItem[] = [
        { field: 'smoking', label: 'Smoking', id: 'smoking-checkbox' },
        { field: 'alcohol', label: 'Alcohol', id: 'alcohol-checkbox' },
        { field: 'sport', label: 'Sport', id: 'sport-checkbox' },
        { field: 'stretching', label: 'Stretching', id: 'stretching-checkbox' },
    ];

    useEffect(() => {
        if (measurement) {
            setEditedMeasurement(measurement);
        }
    }, [measurement]);

    const handleChange = <K extends keyof PressureMeasurementDto>(
        field: K,
        value: PressureMeasurementDto[K]
    ) => {
        setEditedMeasurement(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!measurement) return;
        
        if (!validateForm()) {
            toast.error('All fields must be filled with valid values!');
            return;
        }

        try {
            const success = await onSubmit(measurement.id, editedMeasurement);
            if (success) onClose();
        } catch (error) {
            toast.error(`Failed to update measurement: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const validateForm = (): boolean => {
        return (
            editedMeasurement.upperPressure > 0 &&
            editedMeasurement.lowerPressure > 0 &&
            editedMeasurement.heartbeat > 0
        );
    };

    if (!open) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerText}>Edit Measurement</div>
                    <div className={styles.close}>
                        <Image src={close} onClick={onClose} width={24} height={24} alt="Close" />
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <div className={styles.pressureCard}>
                            <div className={styles.inputGroup}>
                                <label>Upper pressure:</label>
                                <input
                                    type="number"
                                    value={editedMeasurement.upperPressure}
                                    onChange={(e) => handleChange('upperPressure', Number(e.target.value))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Lower pressure:</label>
                                <input
                                    type="number"
                                    value={editedMeasurement.lowerPressure}
                                    onChange={(e) => handleChange('lowerPressure', Number(e.target.value))}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Heartbeat:</label>
                                <input
                                    type="number"
                                    value={editedMeasurement.heartbeat}
                                    onChange={(e) => handleChange('heartbeat', Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Lifestyle</h3>
                        <div className={styles.lifestyleForm}>
                            <div className={styles.inputGroup}>
                                <label>Description:</label>
                                <textarea
                                    value={editedMeasurement.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </div>
                            <div className={styles.checkboxGroup}>
                                {checkboxItems.map((item) => (
                                    <div key={item.id} className={styles.checkboxContainer}>
                                        <label htmlFor={item.id}>{item.label}</label>
                                        <Checkbox
                                            id={item.id}
                                            name={item.field}
                                            checked={editedMeasurement[item.field] as boolean}
                                            onChange={(e) => handleChange(item.field, e.target.checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.buttons}>
                    <TextButton text="Cancel" variant="light" onClick={onClose} />
                    <TextButton text="Save" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default EditMeasurementModal;