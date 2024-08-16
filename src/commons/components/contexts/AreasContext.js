'use client';

import {createContext, useContext, useEffect, useState} from "react";
import {fetchApi} from "@/commons/utils/api";

const AreasGetterContext = createContext([]);
const AreasSetterContext = createContext(() => {
});

export function AreasProvider({children}) {
    const [areas, setAreas] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                setAreas(await fetchApi('/api/areas'));
            } catch (error) {
                console.error('Error fetching areas:', error);
                setAreas([]);
            } finally {
            }
        }

        fetchData();
    }, []);

    return (
        <AreasGetterContext.Provider value={areas}>
            <AreasSetterContext.Provider value={setAreas}>
                {children}
            </AreasSetterContext.Provider>
        </AreasGetterContext.Provider>
    );
}

export function useAreas() {
    return useContext(AreasGetterContext);
}

export function useAreasSetter() {
    return useContext(AreasSetterContext);
}