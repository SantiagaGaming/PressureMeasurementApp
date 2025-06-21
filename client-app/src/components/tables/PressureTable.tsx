import React, { useState } from 'react';
import styles from './PressureTable.module.css';
import {
    LifestyleDto,
    PressureDto,
    PressureMeasurementResponse,
    PressureState,
} from '@/types/types';
import { arrowDown, columns } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';
import { Pagination } from 'react-bootstrap';
import Loader from '../loader/Loader';

interface PressureTableProps {
    measurements: PressureMeasurementResponse[];
    loading: boolean;
    onAdd?: (data: {
        Pressures: PressureDto[];
        Lifestyle: LifestyleDto;
    }) => Promise<boolean>;
    onUpdate?: (
        id: number,
        updatedData: Partial<PressureMeasurementResponse>
    ) => Promise<boolean>;
    onDelete?: (id: number) => Promise<boolean>;
    onRefresh?: () => Promise<void>;
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    onSort?: (sortKey: string) => void;
}

interface TableHeaderCellProps {
    children: React.ReactNode;
    sortable?: boolean;
    sortKey?: string;
    onSort?: (sortKey: string) => void;
}

const TableHeaderCell = ({
    children,
    sortable = false,
    sortKey = '',
    onSort = () => {},
}:TableHeaderCellProps) => (
    <div className={styles.cellLayoutHeader}>
        <div className={styles.cellHeader}>
            {children}
            {sortable && (
                <img
                    src={arrowDown}
                    width={17}
                    height={17}
                    onClick={() => onSort(sortKey)}
                    style={{ cursor: 'pointer' }}
                    alt="Sort"
                />
            )}
        </div>
    </div>
);

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

const TableCell = ({ children, className = '' }:TableCellProps) => (
    <div className={`${styles.cellLayout} ${className}`}>
        <div className={styles.cell}>{children}</div>
    </div>
);

const PressureTable = ({
    measurements,
    loading,
    onAdd,
    onUpdate,
    onDelete,
    onRefresh,
    currentPage,
    totalPages,
    onPageChange,
    onSort,
}: PressureTableProps) => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [currentMeasurement, setCurrentMeasurement] =
        useState<PressureMeasurementResponse | null>(null);

    const getPressureStateLabel = (state: PressureState | null | undefined) => {
        if (!state) return '-';
        return state.Name;
    };

    const handleRowClick = (id: number) => {
        const measurement = measurements.find(m => m.Id === id);
        if (measurement) {
            setCurrentMeasurement(measurement);
            setOpenEditDialog(true);
        }
    };

    const formatDateString = (dateString: string) => {
        try {
            return formatDate(new Date(dateString).toString());
        } catch (e) {
            console.error('Error formatting date:', dateString, e);
            return 'Invalid date';
        }
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableLayout}>
                <div className={styles.tableHeader}>
                    <TableHeaderCell sortable onSort={onSort} sortKey="id">
                        №
                    </TableHeaderCell>
                    {columns.map((column) => (
                        <TableHeaderCell
                            key={column.key}
                            sortable={column.sortable}
                            sortKey={column.key}
                            onSort={onSort}
                        >
                            {column.label}
                        </TableHeaderCell>
                    ))}
                    <div className={styles.buttonsCellHeaderLayout}>
                        <div className={styles.buttonsCellHeader}>Actions</div>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loadingRow}><Loader/></div>
                ) : measurements.length === 0 ? (
                    <div className={styles.emptyRow}>No measurements found</div>
                ) : (
                    measurements.map((measurement, index) => (
                        <div
                            key={measurement.id}
                            className={styles.tableRow}
                            onClick={() => handleRowClick(measurement.id)}
                        >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{measurement.id}</TableCell>
                            <TableCell>{measurement.upperPressure}</TableCell>
                            <TableCell>{measurement.lowerPressure}</TableCell>
                            <TableCell>{measurement.heartbeat}</TableCell>
                            <TableCell>
                                {formatDateString(measurement.measureDate)}
                            </TableCell>
                            <TableCell>
                                {measurement.smoking ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell>
                                {measurement.alcohol ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell>
                                {measurement.sport ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell>
                                {measurement.stretching ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell>
                                {getPressureStateLabel(measurement.pressureState)}
                            </TableCell>
                            <TableCell>{measurement.description}</TableCell>

                            <div className={styles.buttonsLayout}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete?.(measurement.id);
                                    }}
                                    className={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <Pagination>
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => onPageChange?.(currentPage - 1)}
                        />
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => onPageChange?.(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange?.(currentPage + 1)}
                        />
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default PressureTable;