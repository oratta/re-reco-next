'use client';

import { useState } from 'react';
import AreaAdd from './AreaAdd';
import ConditionCreate from './ConditionCreate';

export default function SettingsView() {
    const [activeTab, setActiveTab] = useState('area');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">設定</h1>
            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'area' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('area')}
                >
                    エリア追加
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'condition' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('condition')}
                >
                    条件作成
                </button>
            </div>
            {activeTab === 'area' ? <AreaAdd /> : <ConditionCreate />}
        </div>
    );
}