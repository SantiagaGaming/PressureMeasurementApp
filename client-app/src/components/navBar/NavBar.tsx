import { useState } from 'react';
import styles from './NavBar.module.css';
import IconButton from '../ui/buttons/iconButton/IconButton';
import * as constants from '@/utils/constants';
import NavBarButton from '../ui/buttons/navBarButton/NavBarButton';

interface NavBarProps {
    onToggle?: (expanded: boolean) => void;
    baseUrl?: string;
}

type NavLink = 'measurements' | 'about';

const NavBar = ({ onToggle, baseUrl = '' }: NavBarProps) => {
    const [expanded, setExpanded] = useState(false);
    const [activeLink, setActiveLink] = useState<NavLink>(() =>
        decodeURIComponent(window.location.pathname).includes('measurements')
            ? 'measurements'
            : 'about'
    );

    const toggleExpand = () => {
        setExpanded((prev) => {
            const next = !prev;
            onToggle?.(next);
            return next;
        });
    };

    const handleClick = (link: NavLink) => () => {
        setActiveLink(link);
        window.location.href = `${baseUrl}/${link}`;
    };

    return (
        <div className={`${styles.navBar} ${expanded ? styles.expanded : ''}`}>
            <div className={styles.arrowWrapper}>
                <IconButton
                    onClick={toggleExpand}
                    expanded={expanded}
                    icon={constants.arrow}
                    width={18}
                    height={18}
                />
            </div>
            <NavBarButton
                logoName={constants.requests}
                title="Measurements"
                expanded={expanded}
                enabled={activeLink === 'measurements'}
                onClick={handleClick('measurements')}
            />
            <NavBarButton
                logoName={constants.suppliers}
                title="About"
                expanded={expanded}
                enabled={activeLink === 'about'}
                onClick={handleClick('about')}
            />
        </div>
    );
};
export default NavBar;
