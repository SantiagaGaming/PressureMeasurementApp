'use client';
import { useState, useEffect } from 'react';
import styles from './NavBar.module.css';
import IconButton from '../ui/buttons/iconButton/IconButton';
import * as constants from '@/utils/constants';
import NavBarButton from '../ui/buttons/navBarButton/NavBarButton';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'; 

interface Props {
    onToggle?: (expanded: boolean) => void;
}

type NavLink = 'measurements' | 'about';

const NavBar = ({ onToggle }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [activeLink, setActiveLink] = useState<NavLink>('measurements');
    const pathname = usePathname();
    const router = useRouter(); 

    useEffect(() => {
        if (pathname?.includes('measurements')) {
            setActiveLink('measurements');
        } else if (pathname?.includes('about')) {
            setActiveLink('about');
        } else {
            setActiveLink('measurements');
        }
    }, [pathname]);

    const toggleExpand = () => {
        setExpanded((prev) => {
            const next = !prev;
            onToggle?.(next);
            return next;
        });
    };

    const handleClick = (link: NavLink) => {
        setActiveLink(link);
        if (link === 'measurements') {
            router.push('/');
        } else if (link === 'about') {
            router.push('/about');
        }
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
                onClick={() => handleClick('measurements')}
            />
            <NavBarButton
                logoName={constants.users}
                title="About"
                expanded={expanded}
                enabled={activeLink === 'about'}
                onClick={() => handleClick('about')}
            />
        </div>
    );
};

export default NavBar;