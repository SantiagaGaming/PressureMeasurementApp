import { Pagination } from 'react-bootstrap';
import styles from '../Tables.module.css';
import * as constants from '../../../../utils/constants';
import { ColoredText } from '../../ColoredText/ColoredText';
import { diffDays, formatDate } from '../../../../utils/helpers';
import { IconButon } from '../../UIKit/Buttons/IconButton/IconButton';
import { Checkbox } from '../../UIKit/Switches/Checkbox/Checkbox';

const statusColors = {
    Активная: 'green',
    Черновик: 'gray',
    'Ожидает решения': 'orange',
    Завершена: 'purple',
};

const TableHeaderCell = ({
    children,
    sortable = false,
    filterable = false,
    sortKey,
    onSort,
    onFilter,
}) => (
    <div className={styles.cellLayoutHeader}>
        <div className={styles.cellHeader}>
            {children}
            {sortable && (
                <img
                    src={import.meta.env.BASE_URL + constants.arrowDown}
                    width={17}
                    height={17}
                    onClick={() => onSort(sortKey)}
                    style={{ cursor: 'pointer' }}
                />
            )}
        </div>
        {filterable && (
            <img
                src={import.meta.env.BASE_URL + constants.filter}
                width={17}
                height={17}
                onClick={(e) => onFilter(e, sortKey)}
            />
        )}
    </div>
);

const TableCell = ({ children, className = '' }) => (
    <div className={`${styles.cellLayout} ${className}`}>
        <div className={styles.cell}>{children}</div>
    </div>
);

 const Temp = ({
    data,
    sortConfig,
    handleSort,
    currentPage,
    itemsPerPage,
    handlePageChange,
    onFilterClick,
    onRowClick,
}) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const canShowDeleteColumn = data.some((order) => order.orderStatusId == 1);

    const getStatusColor = (statusText) => statusColors[statusText] || 'gray';

    return (
        <div className={styles.tableLayout}>
            <div className={styles.tableHeader}>
                <div className={styles.checkboxCellLayoutHeader}>
                    <Checkbox />
                </div>

                <div className={styles.numberCellLayoutHeader}>
                    <div className={styles.numberCellHeader}>
                        №
                        <img
                            src={import.meta.env.BASE_URL + constants.arrowDown}
                            width={17}
                            height={17}
                            onClick={() => handleSort('id')}
                        />
                    </div>
                </div>

                <TableHeaderCell sortKey="name" sortable onSort={handleSort}>
                    Название заявки
                </TableHeaderCell>

                <TableHeaderCell
                    sortKey="orderTypeName"
                    sortable
                    onSort={handleSort}
                >
                    Тип заявки
                </TableHeaderCell>

                <TableHeaderCell
                    sortKey="orderStatusName"
                    sortable
                    onSort={handleSort}
                >
                    Статус
                </TableHeaderCell>

                <TableHeaderCell
                    sortKey="statusChangeDate"
                    sortable
                    onSort={handleSort}
                >
                    Дата смены статуса
                </TableHeaderCell>

                <TableHeaderCell
                    sortKey="cpSubmissionDate"
                    sortable
                    onSort={handleSort}
                >
                    Дней в работе
                </TableHeaderCell>

                <TableHeaderCell
                    sortKey="cpSubmissionDate"
                    sortable
                    onSort={handleSort}
                >
                    Дедлайн
                </TableHeaderCell>

                <TableHeaderCell sortKey="legalEntities">
                    Юр. лицо
                </TableHeaderCell>

                <TableHeaderCell sortKey="creatorUserName">
                    Автор
                </TableHeaderCell>

                <div className={styles.buttonsCellHeaderLayout}>
                    <div className={styles.buttonsCellHeader}></div>
                </div>

                {canShowDeleteColumn && (
                    <div className={styles.buttonsCellHeader}></div>
                )}
            </div>

            {currentData.map((order) => (
                <div
                    key={order.id}
                    className={styles.tableRow} // Изменено с tableCell на tableRow
                    onClick={() => onRowClick(order.id, order.orderTypeId)}
                >
                    <div className={styles.checkboxLayout}>
                        <Checkbox />
                    </div>

                    <div className={styles.numberCellLayout}>{order.id}</div>

                    <div className={styles.cellLayout}>{order.name}</div>

                    <div className={styles.cellLayout}>
                        <ColoredText text={order.orderTypeName} color="blue" />
                    </div>

                    <div className={styles.cellLayout}>
                        <ColoredText
                            text={order.orderStatusName}
                            color={getStatusColor(order.orderStatusName)}
                        />
                    </div>

                    <div className={styles.cellLayout}>
                        {formatDate(order.statusChangeDate)}
                    </div>

                    <div className={styles.cellLayout}>
                        {diffDays(order.cpSubmissionDate)}
                    </div>

                    <div className={styles.cellLayout}>
                        {formatDate(order.cpSubmissionDate)}
                    </div>

                    <div className={styles.cellLayout}>
                        {order.legalEntities
                            ?.map((entity) => entity.name)
                            .join(', ')}
                    </div>

                    <div className={styles.cellLayout}>
                        {order.creatorUserName}
                    </div>

                    <div className={styles.buttonsLayout}>
                        <IconButon icon={constants.chats} />
                        <IconButon icon={constants.needle} />
                    </div>
                </div>
            ))}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <Pagination>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            )}
        </div>
    );
};
export default Temp;