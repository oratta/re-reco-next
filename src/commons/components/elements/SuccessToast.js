import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessToast = ({ message, duration = 2000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 animate-fade-in-up">
            <CheckCircle size={20} />
            <span>{message}</span>
        </div>
    );
};

export default SuccessToast;