import Image, { StaticImageData } from 'next/image';
import styles from './NavBarButton.module.css';

interface NavBarButtonProps {
    onClick: () => void;
    logoName: string | StaticImageData;
    title: string;
    expanded?: boolean;
    enabled?: boolean;
}

const NavBarButton = ({
    onClick,
    logoName,
    title,
    expanded,
    enabled,
}: NavBarButtonProps) => {
    return (
        <button
            className={`
                ${styles.button}
                ${expanded ? styles.expanded : ''}
                ${enabled ? styles.buttonActive : ''}
            `}
            onClick={onClick}
            title={title}
            aria-label={title} 
        >
            <Image
                src={logoName}
                alt="" 
                className={styles.img}
                width={24}
                height={24}
                priority={false}
            />
            <span className={styles.title}>{title}</span>
        </button>
    );
};

export default NavBarButton;