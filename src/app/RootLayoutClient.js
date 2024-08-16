'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SplashScreen from "@/commons/components/elements/SplashScreen";

export default function RootLayoutClient({children}) {
    const [isLoading, setIsLoading] = useState(true);

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
            <h1 className="text-4xl text-gray-800 font-bold my-2">
                <div className="flex">
                    <div className="">
                        <Image
                            src="/logo.png"
                            alt="logo image"
                            width={64}
                            height={64}
                        />
                    </div>
                    <div className="items-center flex">
                        re-reco
                    </div>
                </div>
            </h1>
            <ul className="flex bg-gray-500 mb-4 pl-2">
                <li className="block px-4 py-2 my-1 hover:bg-gray-700 rounded">
                    <Link className="no-underline text-blue-300" href="/job-order">
                        JobOrder
                    </Link>
                </li>
                <li className="block px-4 py-2 my-1 hover:bg-gray-700 rounded">
                    <Link className="no-underline text-blue-300" href="/recommend">
                        Recommend
                    </Link>
                </li>
                <li className="block px-4 py-2 my-1 hover:bg-gray-700 rounded">
                    <Link className="no-underline text-blue-300" href="/settings">
                        Settings
                    </Link>
                </li>
            </ul>
            <div className="ml-2">
                {children}
            </div>
        </>
    );
}