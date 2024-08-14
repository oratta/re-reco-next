'use client';

import React, { useEffect, useState } from 'react';
import AreaAdd from './AreaAdd';
import ConditionCreate from './ConditionCreate';
import { fetchApi } from "@/commons/utils/api";
import SuccessDialog from '@/commons/components/elements/SuccessDialog';

export default function SettingsView() {
    const [activeTab, setActiveTab] = useState('area');
    const [areas, setAreas] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const fetchedAreas = await fetchApi('/api/areas');
                console.log(fetchedAreas);
                // fetchedAreasが配列であることを確認
                setAreas(fetchedAreas);
            } catch (error) {
                console.error('Error fetching areas:', error);
                setError('エリアの取得中にエラーが発生しました。');
                setAreas([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        console.log('Dialog state changed:', isDialogOpen);
    }, [isDialogOpen]);

    async function addArea(data) {
        const { areaName, areaCode } = data;
        try {
            const result = await fetchApi('/api/areas', 'POST', { areaName, areaCode });
            setAreas(prevAreas => [...prevAreas, result]);
            setIsDialogOpen(true);

        } catch (error) {
            console.error(`Error occurred while creating area: ${error}`);
            setError(`Error occurred while creating area`);
        }
    }

    async function deleteArea(areaCode) {
        try {
            // const result = await fetchApi(`/api/areas/${areaCode}`, 'DELETE');
            const result = { success: true };
            if (result.success) {
                setAreas(prevAreas => prevAreas.filter(area => area.code !== areaCode));
            }
        } catch (error) {
            console.error(`Error occurred while deleting area: ${error}`);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <SuccessDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                title="操作成功"
                message="エリアが正常に追加されました。"
            />

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
                {activeTab === 'area' ?
                    <AreaAdd
                        areas={areas}
                        parentSetAreas={setAreas}
                        parentOnSubmit={addArea}
                        parentOnDelete={deleteArea}
                    />
                    :
                    <ConditionCreate />
                }
            </div>
        </>
    );
}