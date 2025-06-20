import styles from './Input.module.css';
interface InputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    imgName: string;
    type?: 'text' | 'number'; 
    readonly?: boolean;
    name: string;
}
const Input = ({
    value,
    onChange,
    placeholder,
    imgName,
    type = 'text',
    readonly = false,
    name,
}: InputProps) => {
    return (
        <div className={styles.input}>
            {imgName && <img src={`/public/${imgName}`} alt="" />}
            <input
                className={styles.text}
                type={type}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
                readOnly={readonly}
                name={name}
                disabled={readonly}
            />
        </div>
    );
};
export default Input;
