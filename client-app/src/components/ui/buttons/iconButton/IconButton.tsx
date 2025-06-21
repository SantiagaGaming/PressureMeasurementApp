import { StaticImageData } from 'next/image';
import styles from './IconButton.module.css';

interface IconButtonProps {
    onClick?: () => void;
    icon: string| StaticImageData;
    width: number;
    height: number;
    expanded?: boolean;
    enabled?: boolean;
    number?: number | null;
}

const IconButton = ({
    onClick,
    icon,
    width,
    height,
    expanded = false,
    enabled = true,
    number = null,
}: IconButtonProps) => {
    return (
        <button className={styles.button} onClick={onClick} disabled={!enabled}>
            <div className={styles.iconWrapper}>
                <img
                    src={icon}
                    width={width}
                    height={height}
                    className={expanded ? styles.rotated : ''}
                />
                {number && (
                    <div className={styles.numberBackground}>
                        <div className={styles.numberText}>{number}</div>
                    </div>
                )}
            </div>
        </button>
    );
};

export default IconButton;
