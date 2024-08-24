import React from 'react';
import { ClipboardList, Calendar, Clock, CheckCircle, XCircle, PlayCircle, PauseCircle } from 'lucide-react';
import {mockData} from "@/commons/utils/mockData";
import { STATUS as JOB_LISTING_STATUS} from "@/commons/models/JobListing";

const mockOrderList = mockData.mockOrderList;

export default function OrderList() {
    const getStatusText = (status) => {
        switch (status) {
            case JOB_LISTING_STATUS.LIST_RUNNING: return 'Preparing';
            case JOB_LISTING_STATUS.EXEC_RUNNING: return 'Running';
            case JOB_LISTING_STATUS.LIST_COMPLETED: return 'Waiting';
            case JOB_LISTING_STATUS.EXEC_COMPLETED: return 'Completed';
            default: return 'Unknown';
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case JOB_LISTING_STATUS.EXEC_RUNNING: return 'text-blue-500';
            case JOB_LISTING_STATUS.LIST_COMPLETED: return 'text-yellow-500';
            case JOB_LISTING_STATUS.EXEC_COMPLETED: return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const getProgressBarColor = (status) => {
        switch (status) {
            case JOB_LISTING_STATUS.EXEC_RUNNING: return 'bg-blue-600';
            case JOB_LISTING_STATUS.LIST_COMPLETED: return 'bg-yellow-600';
            case JOB_LISTING_STATUS.EXEC_COMPLETED: return 'bg-green-600';
            default: return 'bg-gray-600';
        }
    };


    const getStatusIcon = (status) => {
        switch (status) {
            case JOB_LISTING_STATUS.EXEC_RUNNING: return <PlayCircle className="animate-spin" />;
            case JOB_LISTING_STATUS.LIST_COMPLETED: return <PauseCircle />;
            case JOB_LISTING_STATUS.EXEC_COMPLETED: return <CheckCircle />;
            default: return null;
        }
    };

    const formatDate = (date, isNow) => {
        if (isNow) {
            return `Today @ ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}~`;
        }
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const formatDuration = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    };
    return (
        <div className="mt-8 w-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ClipboardList className="mr-2" size={24} />
                Order List
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {mockOrderList.map((order) => (
                    <div key={order.id} className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">
                                {formatDate(order.targetDate, order.isNow)} @ {order.areaName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                                <span className="ml-1">{getStatusText(order.status)}</span>
              </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                                <Clock className="mr-1" size={16} />
                                {order.status === JOB_LISTING_STATUS.EXEC_RUNNING && (
                                    <span>
                    Elapsed: {formatDuration(Date.now() - order.startTime.getTime())}
                  </span>
                                )}
                                {order.status === JOB_LISTING_STATUS.EXEC_COMPLETED && (
                                    <span>
                    Duration: {formatDuration(order.estimatedEndTime.getTime() - order.startTime.getTime())}
                  </span>
                                )}
                                {order.status === JOB_LISTING_STATUS.LIST_COMPLETED && (
                                    <span>
                    Queue Position: {order.queuePosition}
                  </span>
                                )}
                            </div>
                            <div className="flex items-center justify-end">
                                <CheckCircle className="mr-1" size={16} />
                                <span>{order.completeCount}</span>
                                <XCircle className="ml-2 mr-1" size={16} />
                                <span>{order.failedCount}</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{Math.round((order.completeCount / order.listSize) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`${getProgressBarColor(order.status)} h-2.5 rounded-full`}
                                    style={{width: `${(order.completeCount / order.listSize) * 100}%`}}
                                ></div>
                            </div>
                        </div>
                        {order.status === 'Running' && (
                            <div className="mt-2 text-sm text-gray-600">
                                Estimated completion: {order.estimatedEndTime.toLocaleTimeString()}
                            </div>
                        )}
                        {order.status === 'Waiting' && (
                            <div className="mt-2 text-sm text-gray-600">
                                Estimated start: {new Date(Date.now() + order.queuePosition * 30 * 60000).toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};