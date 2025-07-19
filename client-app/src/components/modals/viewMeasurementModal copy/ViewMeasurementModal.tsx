import React, { useState, useEffect } from 'react';
import styles from './ViewMeasurementModal.module.css';
import TextButton from '@/components/ui/buttons/textButton/TextButton';
import Image from 'next/image';
import { close } from '@/utils/constants';
import Checkbox from '@/components/ui/inputs/checkBox/CheckBox';
import { PressureMeasurementDto } from '@/shared/types/pressureMeasurements.types';

interface ViewMeasurementModalProps {
    open: boolean;
    onClose: () => void;
    measurement?: PressureMeasurementDto | null;
}

interface CheckboxItem {
    field: keyof PressureMeasurementDto;
    label: string;
    id: string;
}

const ViewMeasurementModal = ({
    open,
    onClose,
    measurement,
}: ViewMeasurementModalProps) => {
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

    
    if (!open) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerText}>View Measurement</div>
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
                                    readOnly={true}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Lower pressure:</label>
                                <input
                                    type="number"
                                    value={editedMeasurement.lowerPressure}
                                     readOnly={true}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Heartbeat:</label>
                                <input
                                    type="number"
                                    value={editedMeasurement.heartbeat}
                                             readOnly={true}
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
                                             readOnly={true}
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
                                                    readOnly={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.buttons}>
                    <TextButton text="Close" variant="light" onClick={onClose} />
                </div>
            </div>
        </div>
    );
};

export default ViewMeasurementModal;