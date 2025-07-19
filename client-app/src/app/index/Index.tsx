'use client';
import { useCallback, useEffect, useState } from 'react';
import PressureTable from '@/components/tables/PressureTable';
import {
    CreateMeasurementRequest,
    PressureMeasurementDto,
} from '@/shared/types/pressureMeasurements.types';
import TextButton from '@/components/ui/buttons/textButton/TextButton';
import AddMeasurementModal from '@/components/modals/addMeasurementModal/AddMeasurementModal';
import ChoiseModal from '@/components/modals/choiceModal/ChoiseModal';
import EditMeasurementModal from '@/components/modals/editMeasurementModal/EditMeasurementModal';
import CalendarInput from '@/components/ui/inputs/calendarInput/CalendarInput';
import usePressureMeasurementHub from '@/hooks/usePressureMeasurementHub';
import ViewMeasurementModal from '@/components/modals/viewMeasurementModal copy/ViewMeasurementModal';

interface PressureMeasurementViewProps {
    measurements: PressureMeasurementDto[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onSort: (sortKey: string) => void;
    onAdd: (measurement: CreateMeasurementRequest) => Promise<boolean>;
    onDelete: (id: number) => void;
    onGet: (id: number) => void;
    onUpdate: (id: number, data: PressureMeasurementDto) => Promise<boolean>;
    measurement?: PressureMeasurementDto | null | undefined;
    onGetWithDates?: (from: Date | null, till: Date | null) => void;
    onExport?: (from: Date | null, till: Date | null) => void;
}

const Index = ({
    measurements : initialMeasurements,
    loading,
    currentPage,
    totalPages,
    onPageChange,
    onSort,
    onAdd,
    onDelete,
    onGet,
    onGetWithDates,
    onUpdate,
    measurement,
    onExport,
}: PressureMeasurementViewProps) => {
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [orderToDeleteId, setOrderToDeleteId] = useState<number>(-1);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [tillDate, setTillDate] = useState<Date | null>(null);
    const [measurements, setMeasurements] = useState<PressureMeasurementDto[]>(initialMeasurements);
    useEffect(() => {
    setMeasurements(initialMeasurements);
}, [initialMeasurements]);
  const handleMeasurementAdded = useCallback((newMeasurement: PressureMeasurementDto) => {
        setMeasurements(prev => [newMeasurement, ...prev]);
    }, []);

    const handleMeasurementUpdated = useCallback((updatedMeasurement: PressureMeasurementDto) => {
        setMeasurements(prev => prev.map(m => 
            m.id === updatedMeasurement.id ? updatedMeasurement : m
        ));
    }, []);

    const handleMeasurementDeleted = useCallback((id: number) => {
        setMeasurements(prev => prev.filter(m => m.id !== id));
    }, []);
     usePressureMeasurementHub({
        onMeasurementAdded: handleMeasurementAdded,
        onMeasurementUpdated: handleMeasurementUpdated,
        onMeasurementDeleted: handleMeasurementDeleted
    });
    const handleCloseAddModal = () => {
        setAddModal(false);
    };
    const handleOpenAddModal = () => {
        setAddModal(true);
    };
    const handleCloseDeleteModal = () => {
        setDeleteModal(false);
    };
    const handleOpenDeleteModal = (id: number) => {
        setOrderToDeleteId(id);
        setDeleteModal(true);
    };
    const handleDelete = () => {
        onDelete(orderToDeleteId);
        setDeleteModal(false);
    };
    const handleOpenEditModal = (id: number) => {
        onGet(id);
        setEditModal(true);
    };
        const handleOpenViewModal = (id: number) => {
        onGet(id);
        setViewModal(true);
    };
    const handleGetMeasurementsWithDates = () => {
        if (onGetWithDates) {
            onGetWithDates(fromDate, tillDate);
        }
    };

    const handleExportMeasurements = () => {
        if (onExport) {
            onExport(fromDate, tillDate);
        }
    };
    const handleClearDates = () => {
        setFromDate(null);
        setTillDate(null);
    };
    return (
        <>
            <div className="right-content ">
                <div className="add-button">
                    <CalendarInput
                        placeholder="Choose date from"
                        onChange={setFromDate}
                        value={fromDate?.toDateString()}
                    />
                    <CalendarInput
                        placeholder="Choose date till"
                        onChange={setTillDate}
                        value={tillDate?.toDateString()}
                    />
                    <TextButton
                        text="Clear "
                        variant="light"
                        onClick={handleClearDates}
                    />
                    <TextButton
                        text="Filter "
                        variant="light"
                        onClick={handleGetMeasurementsWithDates}
                    />
                    <TextButton
                        text="Export"
                        variant="dark"
                        onClick={handleExportMeasurements}
                    />
                    <TextButton text="Add" onClick={handleOpenAddModal} />
                </div>

                <PressureTable
                    measurements={measurements}
                    loading={loading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    onSort={onSort}
                    onSetDeleteId={handleOpenDeleteModal}
                    onSetId={handleOpenEditModal}
                    onRowClick={handleOpenViewModal}
                />
            </div>
            <AddMeasurementModal
                open={addModal}
                onClose={handleCloseAddModal}
                onSubmit={onAdd}
            />
            <ChoiseModal
                open={deleteModal}
                onClose={handleCloseDeleteModal}
                onSubmit={handleDelete}
                titleText="Delete measurement"
                text="Are you sure want to delete measurement?"
            />
            <EditMeasurementModal
                open={editModal}
                onClose={() => setEditModal(false)}
                onSubmit={onUpdate}
                measurement={measurement}
            />
            <ViewMeasurementModal
                open={viewModal}
                onClose={() => setViewModal(false)}
                measurement={measurement}
            />
        </>
    );
};
export default Index;
