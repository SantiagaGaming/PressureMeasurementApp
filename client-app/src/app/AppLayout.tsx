'use client';
import { useState } from 'react';
import NavBar from '@/components/navBar/NavBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [navExpanded, setNavExpanded] = useState(false);

    return (
       <div className="app-layout">
                <div
                    className="nav-bar-left "
                    style={{
                        width: navExpanded ? '230px' : '50px',
                        transition: 'width 0.3s ease',
                    }}
                >
                    <NavBar onToggle={setNavExpanded} />
            </div>
            <div>{children}</div>
        </div>
    );
}
