'use client';

import React, { createContext, useContext, useState } from 'react';
import SplashScreen from "@/commons/components/elements/SplashScreen";

const LoadingGetterContext = createContext(false);
const LoadingSetterContext = createContext(() => {});

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingGetterContext.Provider value={isLoading}>
            <LoadingSetterContext.Provider value={setIsLoading}>
                {isLoading && <SplashScreen />}
                {children}
            </LoadingSetterContext.Provider>
        </LoadingGetterContext.Provider>
    );
}

export function useLoadingState() {
    return useContext(LoadingGetterContext);
}

export function useLoadingSetter() {
    return useContext(LoadingSetterContext);
}

// 便利な関数として、状態と設定関数の両方を返す関数も提供
export function useLoading() {
    const isLoading = useLoadingState();
    const setIsLoading = useLoadingSetter();
    return { isLoading, setIsLoading };
}