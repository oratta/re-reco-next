'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SplashScreen from "@/commons/components/elements/SplashScreen";
import { Menu } from 'lucide-react';

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

    if (isLoading) {
        return <SplashScreen/>;
    }

    return (
        <>
            <header className="flex justify-between items-center p-4 bg-white shadow-md">
                <h1 className="text-2xl text-gray-800 font-bold flex items-center">
                    <Image
                        src="/logo.png"
                        alt="logo image"
                        width={40}
                        height={40}
                        className="mr-2"
                    />
                    re-reco
                </h1>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    <Menu size={24} />
                </button>
            </header>

            {isMenuOpen && (
                <nav className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link href="/job-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        JobOrder
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
        </>
    );
}