'use client';

import { useState } from 'react';

export default function ConditionCreate() {
    const [conditionName, setConditionName] = useState('');
    const [conditionValue, setConditionValue] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: Implement API call to create new condition
        console.log('Creating new condition:', { name: conditionName, value: conditionValue });
        // Reset form after submission
        setConditionName('');
        setConditionValue('');
    };

    return (
        <div className="max-w-md">
            <h2 className="text-2xl font-semibold mb-4">条件作成</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="conditionName" className="block text-sm font-medium text-gray-700">
                        条件名
                    </label>
                    <input
                        type="text"
                        id="conditionName"
                        value={conditionName}
                        onChange={(e) => setConditionName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="conditionValue" className="block text-sm font-medium text-gray-700">
                        条件値
                    </label>
                    <input
                        type="text"
                        id="conditionValue"
                        value={conditionValue}
                        onChange={(e) => setConditionValue(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    条件を作成
                </button>
            </form>
        </div>
    );
}