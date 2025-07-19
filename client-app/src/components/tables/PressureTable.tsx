import styles from './PressureTable.module.css';
import {
    PressureMeasurementDto,
    PressureState,
} from '@/shared/types/pressureMeasurements.types';
import { arrowDown, columns } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';
import { Pagination } from 'react-bootstrap';
import Loader from '../loader/Loader';
import TextButton from '../ui/buttons/textButton/TextButton';
import Image from 'next/image';

interface PressureTableProps {
    measurements: PressureMeasurementDto[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    onSort?: (sortKey: string) => void;
    onRowClick?: (id: number) => void;
    onSetDeleteId: (id: number) => void;
    onSetId: (id: number) => void;
}

interface TableHeaderCellProps {
    children: React.ReactNode;
    sortable?: boolean;
    sortKey?: string;
    width?: string | number;
    onSort?: (sortKey: string) => void;
}

const TableHeaderCell = ({
    children,
    sortable = false,
    sortKey = '',
    width = 'auto',
    onSort = () => {},
}: TableHeaderCellProps) => (
    <div
        className={styles.cellHeader}
        style={{ width }}
        onClick={() => sortable && onSort(sortKey)}
    >
        <span>{children}</span>
        {sortable && (
            <Image
                src={arrowDown}
                width={17}
                height={17}
                style={{ cursor: 'pointer', marginLeft: '4px' }}
                alt="Sort"
                priority={false}
            />
        )}
    </div>
);

interface TableCellProps {
    children: React.ReactNode;
    width?: string | number;
}

const TableCell = ({ children, width = 'auto' }: TableCellProps) => (
    <div className={styles.cell} style={{ width }}>
        {children}
    </div>
);

const PressureTable = ({
    measurements,
    loading,
    currentPage,
    totalPages,
    onPageChange,
    onSort,
    onRowClick,
    onSetDeleteId,
    onSetId,
}: PressureTableProps) => {
    const getPressureStateLabel = (state: PressureState | null | undefined) => {
        return state?.name || '-';
    };

    const formatDateString = (dateString: string) => {
        try {
            return formatDate(new Date(dateString).toString());
        } catch (e) {
            console.error('Error formatting date:', dateString, e);
            return 'Invalid date';
        }
    };
    const columnWidths = {
        index: '50px',
        id: '80px',
        upperPressure: '100px',
        lowerPressure: '100px',
        heartbeat: '80px',
        measureDate: '120px',
        smoking: '80px',
        alcohol: '80px',
        sport: '80px',
        stretching: '80px',
        pressureState: '120px',
        description: '120px',
        actions: '140px',
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <div className={styles.header}>
                    <TableHeaderCell width={columnWidths.index}>
                        №
                    </TableHeaderCell>
                    {columns.map((column) => (
                        <TableHeaderCell
                            key={column.key}
                            width={
                                columnWidths[
                                    column.key as keyof typeof columnWidths
                                ] || 'auto'
                            }
                            sortable={column.sortable}
                            sortKey={column.key}
                            onSort={onSort}
                        >
                            {column.label}
                        </TableHeaderCell>
                    ))}
                    <TableHeaderCell width={columnWidths.actions}>
                        Actions
                    </TableHeaderCell>
                </div>
                <div className={styles.body}>
                    {loading ? (
                        <div className={styles.loadingRow}>
                            <Loader />
                        </div>
                    ) : measurements.length === 0 ? (
                        <div className={styles.emptyRow}>
                            No measurements found
                        </div>
                    ) : (
                        measurements.map((measurement, index) => (
                            <div
                                key={measurement.id}
                                className={styles.row}
                                onClick={() => onRowClick?.(measurement.id)}
                            >
                                <TableCell width={columnWidths.index}>
                                    {index + 1}
                                </TableCell>
                                <TableCell width={columnWidths.id}>
                                    {measurement.id}
                                </TableCell>
                                <TableCell width={columnWidths.upperPressure}>
                                    {measurement.upperPressure}
                                </TableCell>
                                <TableCell width={columnWidths.lowerPressure}>
                                    {measurement.lowerPressure}
                                </TableCell>
                                <TableCell width={columnWidths.heartbeat}>
                                    {measurement.heartbeat}
                                </TableCell>
                                <TableCell width={columnWidths.measureDate}>
                                    {formatDateString(
                                        measurement.measureDate.toString()
                                    )}
                                </TableCell>
                                <TableCell width={columnWidths.smoking}>
                                    {measurement.smoking ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell width={columnWidths.alcohol}>
                                    {measurement.alcohol ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell width={columnWidths.sport}>
                                    {measurement.sport ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell width={columnWidths.stretching}>
                                    {measurement.stretching ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell width={columnWidths.pressureState}>
                                    {getPressureStateLabel(
                                        measurement.pressureState
                                    )}
                                </TableCell>
                                <TableCell width={columnWidths.description}>
                                    {measurement.description}
                                </TableCell>

                                <div
                                    className={styles.actionsCell}
                                    style={{ width: columnWidths.actions }}
                                >
                                    <TextButton
                                        text="Edit"
                                        variant="light"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSetId(measurement.id);
                                        }}
                                    />
                                    <TextButton
                                        text="Delete"
                                        variant="danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSetDeleteId(measurement.id);
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {totalPages > 1 && (
                <div className={styles.pagination}>
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
