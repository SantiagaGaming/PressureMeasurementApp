import Image from 'next/image';
import styles from './TextButton.module.css';

interface TextButtonProps {
    onClick?: (e: React.MouseEvent) => void;
    text: string;
    icon?: string;
    variant?: string;
    enabled?: boolean;
}

const TextButton = ({
    onClick,
    text,
    icon,
    variant = 'primary',
    enabled = true,
}: TextButtonProps) => {
    const buttonClassName = `${styles.button} ${styles[variant]}`;

    return (
        <div>
            <button
                className={buttonClassName}
                onClick={onClick}
                disabled={!enabled}
            >
                {icon && (
                    <Image
                        src={icon}
                        alt=""
                        className={
                            variant === 'primary' || variant === 'dark'
                                ? styles.imgLight
                                : styles.imgDark
                        }
                        width={24}
                        height={24}
                        priority={false}
                    />
                )}
                {text}
            </button>
        </div>
    );
};
export default TextButton;
