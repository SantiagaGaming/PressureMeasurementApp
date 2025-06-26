import { useRef, useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';
import styles from './CalendarInput.module.css';

interface CalendarInputProps {
    onChange?: (date: Date | null) => void; 
    name?: string;
    value?: string | null; 
    readonly?: boolean;
    placeholder?: string;
}

const CalendarInput = ({
    onChange,
    name,
    value,
    readonly,
    placeholder = 'Choose date',
}: CalendarInputProps) => {
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [rawDate, setRawDate] = useState<string>('');

useEffect(() => {
    if (!value) {
        setSelectedDate('');
        setRawDate('');
        return;
    }
    
    const parsedDate = new Date(value);
    if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate.toLocaleDateString('ru-RU'));
        setRawDate(parsedDate.toISOString().split('T')[0]);
    }
}, [value]);

const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (readonly) return;

    const date = new Date(e.target.value);
    if (isNaN(date.getTime())) {
        setSelectedDate('');
        setRawDate('');
        return;
    }

    const formatted = date.toLocaleDateString('ru-RU');
    setSelectedDate(formatted);
    setRawDate(e.target.value);
    if (onChange) onChange(date);
};

    const openCalendar = (e: React.MouseEvent<HTMLDivElement>) => {
        if (readonly) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        hiddenInputRef.current?.showPicker?.();
    };

    return (
        <div
            className={`${styles.wrapper} ${readonly ? styles.disabled : ''}`}
            onClick={openCalendar}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) =>
                readonly && e.preventDefault()
            }
            tabIndex={readonly ? -1 : 0}
        >
            <input
                type="text"
                readOnly
                value={selectedDate}
                placeholder={placeholder}
                className={styles.input}
            />
            <input
                type="date"
                ref={hiddenInputRef}
                value={rawDate}
                onChange={handleDateChange}
                className={styles.hidden}
                name={name}
                disabled={readonly}
            />
        </div>
    );
};

export default CalendarInput;
