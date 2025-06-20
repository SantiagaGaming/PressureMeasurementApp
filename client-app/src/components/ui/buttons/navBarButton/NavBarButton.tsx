import styles from './NavBarButton.module.css';

interface NavBarButtonProps {
    onClick: () => void;
    logoName: string;
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
        >
            <img src={`/publi/${logoName}`} alt="" className={styles.img} />
            <span className={styles.title}>{title}</span>
        </button>
    );
};
export default NavBarButton;
