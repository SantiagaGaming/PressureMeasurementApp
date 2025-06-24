'use client';
import { useState } from 'react';
import NavBar from '@/components/navBar/NavBar';
import PressureTable from '@/components/tables/PressureTable';
import {
    CreateMeasurementRequest,
    PressureMeasurementDto,
} from '@/shared/types/pressureMeasurements.types';
import TextButton from '@/components/ui/buttons/textButton/TextButton';
import AddMeasurementModal from '@/components/modals/addMeasurementModal/AddMeasurementModal';
import ChoiseModal from '@/components/modals/choiceModal/ChoiseModal';
import EditMeasurementModal from '@/components/modals/editMeasurementModal/EditMeasurementModal';

interface PressureMeasurementViewProps {
    measurements: PressureMeasurementDto[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onSort: (sortKey: string) => void;
    onAdd: (measurement: CreateMeasurementRequest) => void;
    onDelete: (id: number) => void;
    onGet: (id: number) => void;
    onUpdate: (id: number, data: PressureMeasurementDto) => void;
    measurement?:PressureMeasurementDto|null|undefined;
}

const Index = ({
    measurements,
    loading,
    currentPage,
    totalPages,
    onPageChange,
    onSort,
    onAdd,
    onDelete,
    onGet,
    onUpdate,
    measurement
}: PressureMeasurementViewProps) => {
    const [navExpanded, setNavExpanded] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [orderToDeleteId, setOrderToDeleteId] = useState<number>(-1);
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
    return (
        <>
            <div className="appLayout">
                <div
                    className="navBarLeft"
                    style={{
                        width: navExpanded ? '230px' : '50px',
                        transition: 'width 0.3s ease',
                    }}
                >
                    <NavBar onToggle={setNavExpanded} />
                </div>
                <div className="rightContent">
                    <div className="addButton">
                        <TextButton
                            text="Add new measurement"
                            onClick={handleOpenAddModal}
                        />
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
            </div>
        </>
    );
};
export default Index;
