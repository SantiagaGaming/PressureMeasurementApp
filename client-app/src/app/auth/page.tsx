'use client';
import React, { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    const handleAuthSuccess = (token: string, user: any) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.authContainer}>
                {isLogin ? (
                    <LoginForm 
                        onSuccess={handleAuthSuccess}
                        onSwitchToRegister={() => setIsLogin(false)}
                    />
                ) : (
                    <RegisterForm 
                        onSuccess={handleAuthSuccess}
                        onSwitchToLogin={() => setIsLogin(true)}
                    />
                )}
            </div>
        </div>
    );
}
