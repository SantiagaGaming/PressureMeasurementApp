'use client';
import styles from './Header.module.css';
import { bell, smallLogo } from '@/utils/constants';
import IconButton from '../ui/buttons/iconButton/IconButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@/shared/types/auth.types';
import { AuthService } from '@/api/authApi';

const Header = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch {
                setUser(null);
            }
        }
    }, []);

    const handleLogoClick = () => {
        router.push('/');
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await AuthService.logout(token);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            router.push('/auth');
        }
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
                    {user && (
                        <div className={styles.userInfo}>
                            <span className={styles.userEmail}>{user.email}</span>
                            <button onClick={handleLogout} className={styles.logoutButton}>
                                Выйти
                            </button>
                        </div>
                    )}
                    <IconButton icon={bell} number={5} width={20} height={20} />
                </div>
            </div>
        </>
    );
};

export default Header;