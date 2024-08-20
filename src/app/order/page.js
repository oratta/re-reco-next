'use client';

import React, { useState } from 'react';
import { SearchCode, ClipboardMinus, RotateCw, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import ConfirmOrderModal from './ConfirmOrderModal';
import { fetchApi } from "@/commons/utils/api";
import { useLoadingSetter } from "@/commons/components/contexts/LoadingContext";
import { useSSEConnection } from './useSSEConnection';

export default function CreateOrder() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJumped, setIsJumped] = useState(false);
    const [isJustNow, setIsJustNow] = useState(false);
    const [areaName, setAreaName] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [listSize, setListSize] = useState(0);
    const [isValidOrder, setIsValidOrder] = useState(false);
    const setIsLoading = useLoadingSetter();

    const { orderList, connectionError } = useSSEConnection();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        const result = await fetchApi('/api/job-listings/confirm', 'POST', setIsLoading, data);
        console.log(result);

        setAreaName(result.areaName);
        setTargetDate(result.targetDate);
        setListSize(result.listSize);
        setIsValidOrder(result.isValid);

        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalConfirm = () => {
        setIsModalOpen(false);
        // Note: fetchOrderList is no longer needed as orderList is updated via SSE
    };

    const handleJump = () => {
        setIsJumped(true);
        const baseUrl = 'https://www.cityheaven.net/tokyo/A1317/A131703/girl-list/typ102-typ103-typ202-typ203-typ204-typ304-typ305-typ306-typ307';
        const url = isJustNow ? baseUrl + 'play1-play10-play20-play30/' : baseUrl;
        window.open(url, '_blank');
    };

    const validateUrl = (value) => {
        if (!value) {
            return "URL is required";
        }
        if (!/^https?:\/\/.+/.test(value)) {
            return "Invalid URL format";
        }
        if (!/A\d{4}\/A\d{6,}/.test(value)) {
            return "select a area detail";
        }
        return true;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'EXEC_RUNNING': return 'text-blue-500';
            case 'EXEC_COMPLETED': return 'text-green-500';
            case 'EXEC_FAILED': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'EXEC_RUNNING': return <RotateCw className="animate-spin" />;
            case 'EXEC_COMPLETED': return <SearchCode />;
            case 'EXEC_FAILED': return <AlertCircle />;
            default: return null;
        }
    };


    return (
        <div className="p-4 max-w-4xl mx-auto">
            {connectionError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {connectionError}</span>
                </div>
            )}
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b-2 border-gray-200">
                <Image src="/concierge.png" alt="Concierge" width={24} height={24}/>
                <h1 className="text-lg font-semibold text-gray-800">Create Order</h1>
            </div>
            <div className="space-y-4">
                <div className="border p-4 rounded-md">
                    <p className="mb-4">Please perform a conditional search on the external site that you're jumping to. If there are more than 300 target cast members, the process cannot be executed, so please tighten the conditions to reduce the number of target cast members. After confirming the conditions, copy the URL and input it into the placeholder below, then press the 'Check' button.</p>
                    <div className="flex justify-center items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={isJustNow}
                                onChange={(e) => setIsJustNow(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span>just now</span>
                        </label>
                        <button onClick={handleJump} className="bg-gray-500 text-white px-4 py-2 rounded-md">Jump</button>
                    </div>
                </div>
                {isJumped && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="paste url"
                                {...register("url", { validate: validateUrl })}
                                className={`w-full border p-2 rounded-md ${errors.url ? 'border-red-500' : ''}`}
                            />
                            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>}
                        </div>
                        <div className="flex justify-end items-center space-x-2">
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center">
                                <SearchCode size={24}/>
                                <span className="ml-2">Check</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
            {orderList.length > 0 && (
                <div className="mt-8 w-full">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <ClipboardMinus className="mr-2" />
                        Order List
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {orderList.map((order) => (
                            <div key={order.id} className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                                {/* Order item content remains the same */}
                                {/* ... */}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ConfirmOrderModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleModalConfirm}
                areaName={areaName}
                targetDate={targetDate}
                count={listSize}
                isValidOrder={isValidOrder}
            />
        </div>
    );
}