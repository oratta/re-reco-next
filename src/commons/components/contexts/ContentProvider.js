'use client';

import {useEffect, useState} from "react";
import JobProcessingContext from '@/commons/components/contexts/JobProcessingContext';
import {AreasProvider} from "@/commons/components/contexts/AreasContext";
import {LoadingProvider} from "@/commons/components/contexts/LoadingContext";

export default function ContentProvider({children}) {
    const [processingJobId, setProcessingJobId] = useState(null);

    useEffect(() => {
        const storedJobId = localStorage.getItem('processingJobId');
        if (storedJobId) {
            setProcessingJobId(storedJobId);
        }
    }, []);

    useEffect(() => {
        if (processingJobId) {
            localStorage.setItem('processingJobId', processingJobId);
        } else {
            localStorage.removeItem('processingJobId');
        }
    }, [processingJobId]);

    return (
        <JobProcessingContext.Provider value={{processingJobId, setProcessingJobId}}>
            <AreasProvider>
                <LoadingProvider>
                    {children}
                </LoadingProvider>
            </AreasProvider>
        </JobProcessingContext.Provider>
    );
}