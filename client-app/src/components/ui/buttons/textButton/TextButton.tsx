import styles from './TextButton.module.css';

interface TextButtonProps {
    onClick: () => void;
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
                    <img
                        src={import.meta.env.BASE_URL + icon}
                        alt=""
                        className={
                            variant === 'primary' || variant === 'dark'
                                ? styles.imgLight
                                : styles.imgDark
                        }
                    />
                )}
                {text}
            </button>
        </div>
    );
};
export default TextButton;
