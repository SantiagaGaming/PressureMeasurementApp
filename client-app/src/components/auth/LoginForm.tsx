'use client';

import React, { useState } from 'react';
import { AuthService } from '@/api/authApi';
import { LoginRequest } from '@/shared/types/auth.types';
import styles from './LoginForm.module.css';

interface LoginFormProps {
    onSuccess: (token: string, user: any) => void;
    onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await AuthService.login(formData);
            onSuccess(response.token, response.user);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка входа в систему');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Вход в систему</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.error}>{error}</div>}
                
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Введите email"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Введите пароль"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </form>

            <div className={styles.switchForm}>
                <span>Нет аккаунта? </span>
                <button 
                    type="button" 
                    onClick={onSwitchToRegister}
                    className={styles.switchButton}
                >
                    Зарегистрироваться
                </button>
            </div>
        </div>
    );
};
