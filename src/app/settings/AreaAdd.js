'use client';

import {useState} from 'react';
import {fetchApi} from "@/commons/utils/api";
import {useForm} from "react-hook-form";

export default function AreaAdd({areas}) {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [areaName, setAreaName] = useState('');
    const [areaCode, setAreaCode] = useState('');

    const onSubmit = async (data) => {
        const {areaName, areaCode} = data;
        // Area name and code uniqueness
        const areaNameExists = areas.some(area => area.name === areaName);
        const areaCodeExists = areas.some(area => area.code === areaCode);
        if (areaNameExists || areaCodeExists) {
            console.error('Area Name or Area Code already exists.');
            return;
        }
        try {
            const result = await fetchApi("/api/areas", "POST", {areaName, areaCode})
            setAreaName('');
            setAreaCode('');
        } catch (error) {
            console.error(`Error occurred while creating area: ${error.message}`);
        }
    };

    return (
        <div className="max-w-md">
            <h2 className="text-2xl font-semibold mb-4">エリア追加</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="areaName" className="block text-sm font-medium text-gray-700">
                        エリア名
                    </label>
                    <input {...register('areaName', {required: true})}
                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.areaName && <p className="text-red-600">Area Name is required</p>}
                </div>
                <div>
                    <label htmlFor="areaCode" className="block text-sm font-medium text-gray-700">
                        エリアコード
                    </label>
                    <input {...register('areaCode', {
                        required: true,
                        pattern: /^[a-z]+\/A\d{4}\/A\d{6}$/i
                    })}
                           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.areaCode && <p className="text-red-600">Invalid Area Code format.</p>}
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    エリアを追加
                </button>
            </form>
        </div>
    );
}