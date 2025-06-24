'use client'
import TextButton from '@/components/ui/buttons/textButton/TextButton';

const NotFound = () => {
    const handleRedirect = () => {
        window.location.href = '/index';
    };
    return (
        <>
            <h1>Page doesn't exist.</h1>
            <TextButton text="Back to home" onClick={handleRedirect} />
        </>
    );
};
export default NotFound;
