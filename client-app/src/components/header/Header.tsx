
'use client';
import styles from './Header.module.css';
import { bell, smallLogo } from '@/utils/constants';
import IconButton from '../ui/buttons/iconButton/IconButton';
import Image from 'next/image';
import { Metadata } from 'next';
import { useState } from 'react';
import NavBar from '../navBar/NavBar';

export const metadata: Metadata = {
    title: 'Pressure managment application',
    description: 'Pressure managment application for individual usage.',
};

const Header = () => {

    return (
        <>
            <div className={styles.header}>
                <Image
                    src={smallLogo}
                    width={38}
                    height={32}
                    alt="Header logo"
                />

                <div className={styles.rightPanel}>
                    <IconButton icon={bell} number={5} width={20} height={20} />
                </div>
            </div>
         
        </>
    );
};
export default Header;
