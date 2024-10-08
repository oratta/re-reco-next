'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from "next/image";
import SplashScreen from "@/commons/components/elements/SplashScreen";
import {Menu} from 'lucide-react';
import clientConsole from "@/commons/utils/clientConsole";

export default function RootLayoutClient({children}) {
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const debugMode = urlParams.get('debug') === 'true';
        clientConsole.info(urlParams);
        clientConsole.setDebugMode(debugMode);

        clientConsole.debug('Debug mode set:', debugMode);
    }, []);

    if (isLoading) {
        return <SplashScreen/>;
    }

    return <>
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            <Link href="/" className="text-2xl text-gray-800 font-bold flex items-center cursor-pointer">
                <Image
                    src="/logo.png"
                    alt="logo image"
                    width={40}
                    height={40}
                    className="mr-1"
                    style={{
                        maxWidth: "100%",
                        height: "auto"
                    }} />
                <h1>re-reco</h1>
            </Link>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <Menu size={24} />
            </button>
        </header>

        {isMenuOpen && (
            <nav className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link href="/order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Order
                </Link>
                <Link href="/recommend" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Recommend
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                </Link>
            </nav>
        )}

        <main className="p-4">
            {children}
        </main>
    </>;
}