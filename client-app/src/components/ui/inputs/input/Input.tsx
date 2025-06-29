import Image from 'next/image';
import styles from './Input.module.css';

interface InputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    imgName?: string; 
    type?: 'text' | 'number';
    readonly?: boolean;
    name: string;
    alt?: string; 
    width?: number; 
    height?: number;
}

const Input = ({
    value,
    onChange,
    placeholder,
    imgName,
    type = 'text',
    readonly = false,
    name,
    alt = '', 
    width = 20, 
    height = 20,
}: InputProps) => {
    return (
        <div className={styles.input}>
            {imgName && (
                <div className={styles.iconContainer}>
                    <Image
                        src={`/public/${imgName}`}
                        alt={alt}
                        width={width}
                        height={height}
                        className={styles.icon}
                        priority={false}
                    />
                </div>
            )}
            <input
                className={styles.text}
                type={type}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
                readOnly={readonly}
                name={name}
                disabled={readonly}
                aria-label={placeholder} 
            />
        </div>
    );
};

export default Input;