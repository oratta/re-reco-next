import React from 'react';
import Image from 'next/image';

export default function SplashScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <Image
                    src="/logo.png"
                    alt="logo image"
                    width={128}
                    height={128}
                />
                <h1 className="text-4xl font-bold mt-4">re-reco</h1>
                <p className="mt-2">Loading...</p>
            </div>
        </div>
    );
};