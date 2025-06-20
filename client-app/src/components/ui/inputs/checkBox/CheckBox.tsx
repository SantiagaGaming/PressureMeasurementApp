import styles from './Checkbox.module.css';

interface CheckboxProps {
    id: string;
    name: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
}

const Checkbox = ({
    id,
    name,
    checked,
    onChange,
    readOnly = false,
}: CheckboxProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!readOnly) {
            onChange(e);
        }
    };

    return (
        <div className={styles.checkboxContainer}>
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={handleChange}
                readOnly={readOnly}
                className={styles.checkboxInput}
            />
        </div>
    );
};

export default Checkbox;