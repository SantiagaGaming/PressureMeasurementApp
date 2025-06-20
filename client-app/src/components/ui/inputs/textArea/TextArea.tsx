import styles from './TextArea.module.css';
interface TextAreaProps {
    value: string;
    onChange: () => void;
    placeholder: string;
    resizable: boolean;
    name: string;
    readonly?: boolean;
}
const TextArea = ({
    value,
    onChange,
    placeholder,
    resizable = false,
    name,
    readonly,
}: TextAreaProps) => {
    return (
        <div className={styles.input}>
            <textarea
                className={`${styles.text} ${!resizable ? styles.noResize : ''}`}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
                name={name}
                readOnly={readonly}
                disabled={readonly}
            />
        </div>
    );
};
export default TextArea;
