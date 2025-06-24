import React, { useState, useEffect } from 'react';
import styles from './EditMeasurementModal.module.css';
import TextButton from '@/components/ui/buttons/textButton/TextButton';
import Image from 'next/image';
import { close } from '@/utils/constants';
import Checkbox from '@/components/ui/inputs/checkBox/CheckBox';
import {
    PressureMeasurementDto,
} from '@/shared/types/pressureMeasurements.types';

interface EditMeasurementModalProps {
    open: boolean;
    onClose: () => void;
    measurement?: PressureMeasurementDto | null|undefined;
    onSubmit: (
        id: number,
        data: PressureMeasurementDto
    ) => void;
}

const EditMeasurementModal = ({
    open,
    onClose,
    measurement,
    onSubmit,
}: EditMeasurementModalProps) => {
    const [editedMeasurement, setEditedMeasurement] = useState<
        Partial<PressureMeasurementDto>
    >({
        upperPressure: 0,
        lowerPressure: 0,
        heartbeat: 0,
        description: '',
        smoking: false,
        alcohol: false,
        sport: false,
        stretching: false,
        pressureState: undefined,
    });
    useEffect(() => {
        if (measurement) {
            setEditedMeasurement({ ...measurement });
        }
    }, [measurement]);

    const handleChange = <K extends keyof PressureMeasurementDto>(
        field: K,
        value: PressureMeasurementDto[K]
    ) => {
        setEditedMeasurement((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (measurement) {
            const success = await onSubmit(measurement.id, editedMeasurement);
                onClose();
        }
    };

    if (!open ) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerText}>Edit Measurement</div>
                    <div className={styles.close}>
                        <Image
                            src={close}
                            onClick={onClose}
                            width={24}
                            height={24}
                            alt="cross"
                        />
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <div className={styles.pressureCard}>
                            <div className={styles.inputGroup}>
                                <label>Upper pressure:</label>
                                <input
                                    type="number"
                                    value={editedMeasurement.upperPressure || 0}
                                    onChange={(e) =>
                                        handleChange(
                                            'upperPressure',
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Lower pressure:</label>
                                <input
                                    type="number"
                                    value={editedMeasurement.lowerPressure || 0}
                                    onChange={(e) =>
                                        handleChange(
                                            'lowerPressure',
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Heartbeat:</label>
                                <input
                                    type="number"
                                    value={editedMeasurement.heartbeat || 0}
                                    onChange={(e) =>
                                        handleChange(
                                            'heartbeat',
                                            parseInt(e.target.value) || 0
                                        )
                                    }
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
                                    value={editedMeasurement.description || ''}
                                    onChange={(e) =>
                                        handleChange(
                                            'description',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className={styles.checkboxGroup}>
                                {[
                                    {
                                        field: 'smoking',
                                        label: 'Smoking',
                                        id: 'smoking-checkbox',
                                    },
                                    {
                                        field: 'alcohol',
                                        label: 'Alcohol',
                                        id: 'alcohol-checkbox',
                                    },
                                    {
                                        field: 'sport',
                                        label: 'Sport',
                                        id: 'sport-checkbox',
                                    },
                                    {
                                        field: 'stretching',
                                        label: 'Stretching',
                                        id: 'stretching-checkbox',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.field}
                                        className={styles.checkboxContainer}
                                    >
                                        <label htmlFor={item.id}>
                                            {item.label}
                                        </label>
                                        <Checkbox
                                            id={item.id}
                                            name={item.field}
                                            checked={
                                                editedMeasurement[
                                                    item.field
                                                ] as boolean
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    item.field as keyof PressureMeasurementDto,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.buttons}>
                    <div className={styles.button}>
                        <TextButton
                            text="Cancel"
                            variant="light"
                            onClick={onClose}
                        />
                    </div>
                    <div className={styles.button}>
                        <TextButton
                            text="Save"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditMeasurementModal;
