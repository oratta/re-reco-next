'use client';

import { useState } from 'react';

export default function AreaAdd() {
    const [areaName, setAreaName] = useState('');
    const [areaCode, setAreaCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: Implement API call to add new area
        console.log('Adding new area:', { name: areaName, code: areaCode });
        // Reset form after submission
        setAreaName('');
        setAreaCode('');
    };

    return (
        <div className="max-w-md">
            <h2 className="text-2xl font-semibold mb-4">エリア追加</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="areaName" className="block text-sm font-medium text-gray-700">
                        エリア名
                    </label>
                    <input
                        type="text"
                        id="areaName"
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="areaCode" className="block text-sm font-medium text-gray-700">
                        エリアコード
                    </label>
                    <input
                        type="text"
                        id="areaCode"
                        value={areaCode}
                        onChange={(e) => setAreaCode(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    エリアを追加
                </button>
            </form>
        </div>
    );
}