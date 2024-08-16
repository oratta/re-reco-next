'use client';

import React, {useEffect, useState} from 'react';
import AreaAdd from './AreaAdd';
import ConditionCreate from './ConditionCreate';
import {fetchApi} from "@/commons/utils/api";
import SuccessDialog from '@/commons/components/elements/SuccessDialog';
import OtherSettings from "@/app/settings/OtherSettings";
import {useAreas, useAreasSetter} from "@/commons/components/contexts/AreasContext";

export default function SettingsView() {
    const [activeTab, setActiveTab] = useState('area');
    const areas = useAreas();
    const setAreas = useAreasSetter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogMessage, setDialogMessage] = useState({
        title: "",
        message: "",
    });

    useEffect(() => {
        console.log('Dialog state changed:', isDialogOpen);
    }, [isDialogOpen]);

    async function addArea(data) {
        const { areaName, areaCode } = data;
        try {
            const result = await fetchApi('/api/areas', 'POST', { areaName, areaCode });
            setAreas(prevAreas => [...prevAreas, result]);
            setIsDialogOpen(true);
            setDialogMessage({
                title: "エリア作成成功",
                message: "エリアが正常に作成されました。"
            });

        } catch (error) {
            console.error(`Error occurred while creating area: ${error}`);
            setError(`Error occurred while creating area`);
        }
    }

    async function deleteArea(id) {
        try {
            await fetchApi(`/api/areas/${id}`, 'DELETE');
            const response = setAreas(prevAreas => prevAreas.filter(area => area.id !== id));
            console.log(response);
            setIsDialogOpen(true);
            setDialogMessage({
                title: "削除成功",
                message: "エリアが正常に削除されました。"
            });

        } catch (error) {
            console.error(`Error occurred while deleting area: ${error}`);
            setError(`Error occurred while creating area`);
        }
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <SuccessDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                title={dialogMessage.title}
                message={dialogMessage.message}
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
                    {/*<button*/}
                    {/*    className={`px-4 py-2 rounded ${activeTab === 'condition' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}*/}
                    {/*    onClick={() => setActiveTab('condition')}*/}
                    {/*>*/}
                    {/*    条件作成*/}
                    {/*</button>*/}
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'other' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('other')}
                    >
                        その他
                    </button>
                </div>
                {activeTab === 'area' ?
                    <AreaAdd
                        areas={areas}
                        parentOnSubmit={addArea}
                        parentOnDelete={deleteArea}
                    />
                    : activeTab === 'condition' ?
                    <ConditionCreate />
                    :
                    <OtherSettings />
                }
            </div>
        </>
    );
}