import React, { useState } from 'react';
import styles from './AddMeasurementModal.module.css';
import {
    PressureDto,
    LifestyleDto,
    CreateMeasurementRequest,
} from '@/shared/types/pressureMeasurements.types';
import TextButton from '@/components/ui/buttons/textButton/TextButton';
import Image from 'next/image';
import { close } from '@/utils/constants';
import Checkbox from '@/components/ui/inputs/checkBox/CheckBox';
import { toast } from 'react-toastify';
import Text from '@/components/ui/text/Text';

interface AddMeasurementModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (measurement: CreateMeasurementRequest) => Promise<boolean>;
}

const AddMeasurementModal = ({
    open,
    onClose,
    onSubmit,
}: AddMeasurementModalProps) => {
    const [multipleMeasurements, setMultipleMeasurements] = useState(true);
    const [pressures, setPressures] = useState<PressureDto[]>([
        { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
        { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
        { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
        { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
    ]);

    const [lifestyle, setLifestyle] = useState<LifestyleDto>({
        description: '',
        smoking: false,
        alcohol: false,
        sport: false,
        stretching: false,
    });

    const handlePressureChange = (
        index: number,
        field: keyof PressureDto,
        value: number
    ) => {
        const newPressures = [...pressures];
        newPressures[index] = { ...newPressures[index], [field]: value };
        setPressures(newPressures);
    };

    const handleLifestyleChange = <K extends keyof LifestyleDto>(
        field: K,
        value: LifestyleDto[K]
    ) => {
        setLifestyle({ ...lifestyle, [field]: value });
    };

    const handleMultipleMeasurementsChange = (checked: boolean) => {
        setMultipleMeasurements(checked);
        setPressures(
            checked
                ? [
                      { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
                      { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
                      { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
                      { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
                  ]
                : [{ upperPressure: 0, lowerPressure: 0, heartbeat: 0 }]
        );
    };

    const validateForm = (): boolean => {
        const measurementsToValidate = multipleMeasurements
            ? pressures
            : [pressures[0]];

        for (const pressure of measurementsToValidate) {
            if (
                pressure.upperPressure <= 0 ||
                pressure.lowerPressure <= 0 ||
                pressure.heartbeat <= 0
            ) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('All fields must be filled with valid values!');
            return;
        }

        try {
            const measurementsToSubmit = multipleMeasurements
                ? pressures
                : [pressures[0]];

            const success = await onSubmit({
                pressures: measurementsToSubmit,
                lifestyle: lifestyle,
            });

            if (success) {
                onClose();
                // Reset to default state
                setMultipleMeasurements(true);
                setPressures([
                    { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
                    { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
                    { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
                    { upperPressure: 0, lowerPressure: 0, heartbeat: 0 },
                ]);
                setLifestyle({
                    description: '',
                    smoking: false,
                    alcohol: false,
                    sport: false,
                    stretching: false,
                });
            }
        } catch (error) {
            toast.error(`Failed to save measurement${error}`);
        }
    };

    if (!open) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        Add new pressure measurement
                    </div>
                    <div className={styles.headerControls}>
                        <div className={styles.multipleMeasurementsToggle}>
                                              <Text text='Multiple measurements'/>
                            <Checkbox
                                id="multiple-measurements"
                                name="multipleMeasurements"
                                checked={multipleMeasurements}
                                onChange={(e) =>
                                    handleMultipleMeasurementsChange(
                                        e.target.checked
                                    )
                                }
                            />
                        </div>
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
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <div className={styles.pressureGrid}>
                            {pressures
                                .slice(
                                    0,
                                    multipleMeasurements ? 4 : 1
                                )
                                .map((pressure, index) => (
                                    <div
                                        key={index}
                                        className={styles.pressureCard}
                                    >
                                        <h4>Measurement {index + 1}</h4>
                                        <div className={styles.inputGroup}>
                                            <label>Upper pressure:</label>
                                            <input
                                                type="number"
                                                value={pressure.upperPressure}
                                                onChange={(e) =>
                                                    handlePressureChange(
                                                        index,
                                                        'upperPressure',
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Lower pressure:</label>
                                            <input
                                                type="number"
                                                value={pressure.lowerPressure}
                                                onChange={(e) =>
                                                    handlePressureChange(
                                                        index,
                                                        'lowerPressure',
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Heartbeat:</label>
                                            <input
                                                type="number"
                                                value={pressure.heartbeat}
                                                onChange={(e) =>
                                                    handlePressureChange(
                                                        index,
                                                        'heartbeat',
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Lifestyle</h3>
                        <div className={styles.lifestyleForm}>
                            <div className={styles.inputGroup}>
                                <label>Description:</label>
                                <textarea
                                    value={lifestyle.description}
                                    onChange={(e) =>
                                        handleLifestyleChange(
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
                                                lifestyle[
                                                    item.field as keyof LifestyleDto
                                                ] as boolean
                                            }
                                            onChange={(e) =>
                                                handleLifestyleChange(
                                                    item.field as keyof LifestyleDto,
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
                        <TextButton text="Add" onClick={handleSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMeasurementModal;