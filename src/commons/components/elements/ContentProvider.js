'use client';

import {useState} from "react";
import JobProcessingContext from '@/commons/contexts/JobProcessingContext';

export default function ContentProvider({children}) {
    const [processingJobId, setProcessingJobId] = useState(null);

    return (
        <JobProcessingContext.Provider value={{processingJobId, setProcessingJobId}}>
        {children}
        </JobProcessingContext.Provider>
    );
}