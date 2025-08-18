'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import NavBar from '@/components/navBar/NavBar';
import Header from '@/components/header/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [navExpanded, setNavExpanded] = useState(false);
    const pathname = usePathname();

    // Если это страница авторизации, не применяем AppLayout
    if (pathname === '/auth') {
        return <>{children}</>;
    }

    return (
        <ProtectedRoute>
            <div className="app-layout">
                <Header />
                <div
                    className="nav-bar-left"
                    style={{
                        width: navExpanded ? '230px' : '50px',
                        transition: 'width 0.3s ease',
                        marginTop: '60px', // Отступ для Header
                    }}
                >
                    <NavBar onToggle={setNavExpanded} />
                </div>
                <div style={{ marginTop: '60px', marginLeft: navExpanded ? '230px' : '50px' }}>
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
