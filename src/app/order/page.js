'use client';

import React, {useState} from 'react';
import {AlertCircle, Calendar, CheckCircle, ClipboardList, Clock, RotateCw, SearchCode, XCircle} from 'lucide-react';
import Image from 'next/image';
import {useForm} from 'react-hook-form';
import ConfirmOrderModal from './ConfirmOrderModal';
import {fetchApi} from "@/commons/utils/api";
import {useLoadingSetter} from "@/commons/components/contexts/LoadingContext";
import {useSSEConnection} from './useSSEConnection';
import {useAreas} from "@/commons/components/contexts/AreasContext";
import {parseUrl} from "@/app/api/job-listings/confirm/confirmJobList";
import clientConsole from "@/commons/utils/clientConsole";
import {STATUS} from "@/commons/models/JobListing";

export default function CreateOrder() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJumped, setIsJumped] = useState(false);
    const [isJustNow, setIsJustNow] = useState(false);
    const [areaName, setAreaName] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [listSize, setListSize] = useState(0);
    const [isValidOrder, setIsValidOrder] = useState(false);
    const [url, setUrl] = useState('');
    const [modalStatus, setModalStatus] = useState('confirm');
    const [statusMessage, setStatusMessage] = useState('');
    const setIsLoading = useLoadingSetter();
    const areas = useAreas();

    const { orderList, connectionError } = useSSEConnection();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleCheck = async (data) => {
        console.log(data);
        const result = await fetchApi('/api/job-listings/confirm', 'POST', setIsLoading, data);
        console.log(result);

        setAreaName(result.areaName);
        setTargetDate(result.targetDate);
        setListSize(result.listSize);
        setIsValidOrder(result.isValid);
        setUrl(data.url);
        setModalStatus('confirm');
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalStatus('confirm');
    };

    const handleCreateOrder = async () => {
        try {
            const {areaCode, targetDate, condition} = parseUrl(url);
            clientConsole.info("parameter: ", {areaCode, targetDate, condition});
            const response = await fetchApi('api/job-listings', 'POST', setIsLoading, { areaCode, targetDate, condition });

            if (response.error) {
                throw new Error(response.error);
            }

            setModalStatus('success');
            setStatusMessage('Order created successfully!');
        } catch (error) {
            clientConsole.error("Failed to create order:", error);
            setModalStatus('error');
            setStatusMessage(error.message || 'Failed to create order. Please try again.');
        }
    };

    const handleJump = () => {
        setIsJumped(true);
        const baseUrl = 'https://www.cityheaven.net/tokyo/A1317/A131703/girl-list/typ102-typ103-typ202-typ203-typ204-typ304-typ305-typ306-typ307/';
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
            case STATUS.EXEC_RUNNING: return 'text-blue-500';
            case STATUS.EXEC_COMPLETED: return 'text-green-500';
            case STATUS.EXEC_FAILED: return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case STATUS.EXEC_RUNNING: return <RotateCw className="animate-spin" />;
            case STATUS.EXEC_COMPLETED: return <SearchCode />;
            case STATUS.EXEC_FAILED: return <AlertCircle />;
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
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <p className="mb-4">Please perform a conditional search on the external site that you're jumping to. If there are more than 300 target cast members, the process cannot be executed, so please tighten the conditions to reduce the number of target cast members. After confirming the conditions, copy the URL and input it into the placeholder below, then press the Check button.</p>
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
                    <form onSubmit={handleSubmit(handleCheck)} className="space-y-4">
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
                        <ClipboardList className="mr-2" size={24} />
                        Order List
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {orderList.map((order) => (
                            <div key={order.id} className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold">{order.areaName}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 flex items-center">
                                    <Calendar className="mr-1" size={16} />
                                    {new Date(order.targetDate).toLocaleDateString()}
                                </p>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center">
                                        <CheckCircle className="mr-1" size={16} />
                                        {order.completeCount}
                                    </span>
                                    <span className="flex items-center">
                                        <Clock className="mr-1" size={16} />
                                        {order.pendingCount}
                                    </span>
                                    <span className="flex items-center">
                                        <XCircle className="mr-1" size={16} />
                                        {order.failedCount}
                                    </span>
                                </div>
                                {order.status === STATUS.EXEC_RUNNING && (
                                <div className="mt-2">
                                    <progress
                                        value={order.completeCount || 0}
                                        max={(order.completeCount || 0) + (order.pendingCount || 0)}
                                        className="w-full"
                                    />
                                </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ConfirmOrderModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleCreateOrder}
                areaName={areaName}
                targetDate={targetDate}
                count={listSize}
                isValidOrder={isValidOrder}
                status={modalStatus}
                statusMessage={statusMessage}
            />
        </div>
    );
}