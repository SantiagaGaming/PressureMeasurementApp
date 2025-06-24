import { useState, useRef, useEffect } from 'react';
import styles from './DropDown.module.css';
import Text from '../text/Text';
import { dropDown } from '@/utils/constants';
import Image from 'next/image';

type DropDownValue = string;

interface DropDownProps {
    values?: DropDownValue[];
    placeholder?: string;
    onSelect?: (value: DropDownValue) => void;
    selected?: DropDownValue | null;
    readonly?: boolean;
}

type Color = 'red' | 'orange' | 'green' | 'black';

const DropDown = ({
    values = [],
    placeholder = 'Выберите значение',
    onSelect,
    selected,
    readonly = false,
}: DropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<DropDownValue | null>(
        null
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (value: DropDownValue) => {
        if (readonly) return;
        setSelectedValue(value || null);
        setIsOpen(false);
        onSelect?.(value);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (selected !== undefined) {
            setSelectedValue(selected || null);
        }
    }, [selected]);

    const getColorByValue = (value: DropDownValue): Color => {
        switch (value) {
            case 'Very High':
            case 'High':
                return 'red';
            case 'Medium':
                return 'orange';
            case 'Low':
                return 'green';
            default:
                return 'black';
        }
    };

    const toggleDropdown = () => {
        if (readonly) return;
        setIsOpen((prev) => !prev);
    };

    return (
        <div
            className={`${styles.dropdown} ${readonly ? styles.readonly : ''}`}
            ref={dropdownRef}
        >
            <div className={styles.input} onClick={toggleDropdown}>
                <div className={styles.text}>
                    {selectedValue ? (
                        <Text text={selectedValue} />
                    ) : (
                        <span className={styles.placeholder}>
                            {placeholder}
                        </span>
                    )}
                </div>
                <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
                    <Image width={16} height={16} src={dropDown} alt="drop Down"/>
                </div>
            </div>
            {isOpen && !readonly && (
                <ul className={styles.list}>
                    {values.map((value, idx) => (
                        <li
                            key={idx}
                            className={styles.item}
                            onClick={() => handleSelect(value)}
                        >
                            <Text text={value} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropDown;
