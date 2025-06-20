export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

export const splitDate = (dateString: string | null | undefined): string => {
    return dateString ? dateString.split('T')[0] : '';
};

export const isGreaterThanToday = (date: Date | string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const inputDate = date instanceof Date ? date : new Date(date);
    
    if (isNaN(inputDate.getTime())) return false;
    
    inputDate.setHours(0, 0, 0, 0); 
    return inputDate >= today;
};