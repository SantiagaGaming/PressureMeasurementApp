'use client';
import styles from './Header.module.css';
import { bell, smallLogo } from '@/utils/constants';
import IconButton from '../ui/buttons/iconButton/IconButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 

const Header = () => {
    const router = useRouter(); 

    const handleLogoClick = () => {
        router.push('/'); 
    };

    return (
        <>
            <div className={styles.header}>
                <Image
                    src={smallLogo}
                    width={40}
                    height={40}
                    alt="Header logo"
                    onClick={handleLogoClick} 
                    style={{ cursor: 'pointer' }} 
                />

                <div className={styles.rightPanel}>
                    <IconButton icon={bell} number={5} width={20} height={20} />
                </div>
            </div>
        </>
    );
};

export default Header;