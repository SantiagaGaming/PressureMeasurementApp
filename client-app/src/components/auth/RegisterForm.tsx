'use client';

import React, { useState } from 'react';
import { AuthService } from '@/api/authApi';
import { RegisterRequest } from '@/shared/types/auth.types';
import styles from './RegisterForm.module.css';

interface RegisterFormProps {
    onSuccess: (token: string, user: any) => void;
    onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        password: '',
        confirmPassword:''
    });
   const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
       const response = await AuthService.register(formData);
            onSuccess(response.token, response.user);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
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
            <h2 className={styles.title}>Регистрация</h2>
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
                        minLength={6}
                        className={styles.input}
                        placeholder="Введите пароль (минимум 6 символов)"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>Подтвердите пароль:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                         name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange }
                        required
                        className={styles.input}
                        placeholder="Повторите пароль"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>

            <div className={styles.switchForm}>
                <span>Уже есть аккаунт? </span>
                <button 
                    type="button" 
                    onClick={onSwitchToLogin}
                    className={styles.switchButton}
                >
                    Войти
                </button>
            </div>
        </div>
    );
};
