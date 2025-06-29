'use client';
import TextButton from '@/components/ui/buttons/textButton/TextButton';
import { useRouter } from 'next/navigation';

const NotFound = () => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/'); 
    };

    return (
        <div className="not-found-container">
            <h1>Page not found</h1>
            <TextButton 
                text="Back to home" 
                onClick={handleRedirect} 
                variant="primary"
            />
        </div>
    );
};
export default NotFound;
