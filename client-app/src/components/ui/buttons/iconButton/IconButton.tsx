import Image, { StaticImageData } from 'next/image';
import styles from './IconButton.module.css';

interface IconButtonProps {
    onClick?: () => void;
    icon: string | StaticImageData;
    width: number;
    height: number;
    expanded?: boolean;
    enabled?: boolean;
    number?: number | null;
    alt?: string; 
}

const IconButton = ({
    onClick,
    icon,
    width,
    height,
    expanded = false,
    enabled = true,
    number = null,
    alt = '', 
}: IconButtonProps) => {
    return (
        <button className={styles.button} onClick={onClick} disabled={!enabled}>
            <div className={styles.iconWrapper}>
                <Image
                    src={icon}
                    width={width}
                    height={height}
                    className={expanded ? styles.rotated : ''}
                    alt={alt}
                    priority={false}
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