import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchApi } from '@/commons/utils/api';

export default function AreaAdd({ areas, parentSetAreas, parentOnSubmit, parentOnDelete }) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        parentOnSubmit(data);
    };

    async function deleteArea(areaId){
        parentOnDelete(areaId);
    }

    return (
        <div className='space-x-4 flex'>
            <div className='w-1/2'>
                <h2 className='text-2xl font-semibold mb-4'>エリア追加</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <label htmlFor='areaName' className='block text-sm font-medium text-gray-700'>
                            エリア名
                        </label>
                        <input
                            {...register('areaName', {
                                required: 'Area Name is required',
                                validate: value =>
                                    !areas.some(area => area.name === value) || 'Area Name already exists.',
                            })}
                            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                        {errors.areaName && <p className='text-red-600'>{errors.areaName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='areaCode' className='block text-sm font-medium text-gray-700'>
                            エリアコード
                        </label>
                        <input
                            {...register('areaCode', {
                                required: 'Area Code is required',
                                pattern: {
                                    value: /^[a-z]+\/A\d{4}\/(A\d{6}(-A\d{6})*)$/i,
                                    message: 'Invalid Area Code format.',
                                },
                                validate: value =>
                                    !areas.some(area => area.code === value) || 'Area Code already exists.',
                            })}
                            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                        {errors.areaCode && <p className='text-red-600'>{errors.areaCode.message}</p>}
                    </div>
                    <button
                        type='submit'
                        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    >
                        エリアを追加
                    </button>
                </form>
            </div>
            <div className="w-1/2">
                <table className='table-auto'>
                    <thead>
                    <tr className='bg-blue-500 text-white'>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Code</th>
                        <th className='px-4 py-2'>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {areas.map((area, index) => (
                        <tr key={area.code} className='hover:bg-gray-100'>
                            <td className='border px-4 py-2 border-gray-300'>{area.name}</td>
                            <td className='border px-4 py-2 border-gray-300'>{area.code}</td>
                            <td className='border px-4 py-2 border-gray-300'>
                                <button onClick={() => deleteArea(area.id)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}