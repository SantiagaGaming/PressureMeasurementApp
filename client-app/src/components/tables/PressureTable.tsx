import React, { useState } from 'react';

import {
    LifestyleDto,
    PressureDto,
    PressureMeasurementResponse,
    PressureState,
} from '@/types/types';

interface PressureTableProps {
    measurements: PressureMeasurementResponse[];
    loading: boolean;
    onAdd: (data: {
        Pressures: PressureDto[];
        Lifestyle: LifestyleDto;
    }) => Promise<boolean>;
    onUpdate: (
        id: number,
        updatedData: Partial<PressureMeasurementResponse>
    ) => Promise<boolean>;
    onDelete: (id: number) => Promise<boolean>;
    onRefresh: () => Promise<void>;
}
const PressureTable: React.FC<PressureTableProps> = ({
    measurements,
    loading,
    onAdd,
    onUpdate,
    onDelete,
    onRefresh,
}) => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [currentMeasurement, setCurrentMeasurement] =
        useState<PressureMeasurementResponse | null>(null);
    const getPressureStateLabel = (state: PressureState | null | undefined) => {
        if (!state) return '-';
        return state.Name;
    };

    return <></>;
};

export default PressureTable;
