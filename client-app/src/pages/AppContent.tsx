import Header from '@/components/header/Header';
import NavBar from '@/components/navBar/NavBar';

 import { ReactNode, useState } from 'react';

interface AppContentProps {
    children: ReactNode;
}

const AppContent = ({ children }: AppContentProps) => {
    const [navExpanded, setNavExpanded] = useState(false);
    
    return (
        <>
            <Header />
            <div className="appLayout">
                <div
                    className="navBarLeft"
                    style={{
                        width: navExpanded ? '230px' : '50px',
                        transition: 'width 0.3s ease',
                    }}
                >
                    <NavBar onToggle={setNavExpanded} />
                </div>
                <div className="rightContent">
                        {children}
                </div>
            </div>
        </>
    );
};

export default AppContent;