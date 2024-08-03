'use client';

import React, { useState, useEffect } from 'react';
import {ChevronUpIcon, ChevronDownIcon} from "@heroicons/react/24/solid";


export default function JobReservationRateListView() {
    const [jobReservationRates, setJobReservationRates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortColumn, setSortColumn] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        fetchData();
    }, [currentPage, sortColumn, sortDirection]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/job-reservation-rates?page=${currentPage}&sort=${sortColumn}&order=${sortDirection}`);
            const data = await response.json();
            setJobReservationRates(data.data);
            setTotalPages(data.meta.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const executeJobReservationRate = async (id) => {
        try {
            const response = await fetch(`/api/job-reservation-rate/${id}`, {
                method: 'POST',
            });
            if (response.ok) {
                alert('Job Reservation Rate execution started');
                fetchData();
            } else {
                alert('Failed to start Job Reservation Rate execution');
            }
        } catch (error) {
            console.error('Error executing job reservation rate:', error);
            alert('Error executing job reservation rate');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Job Reservation Rates</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    {['id', 'status', 'castCode', 'areaCode', 'groupCode', 'reservedRate', 'reservedCount', 'emptyCount', 'totalCount', 'isLastList', 'createdAt', 'updatedAt', 'actions'].map((column) => (
                        <th
                            key={column}
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort(column)}
                        >
                            {column}
                            {sortColumn === column && (
                                sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4 inline-block ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline-block ml-1" />
                            )}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {jobReservationRates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{rate.id}</td>
                        <td className="py-2 px-4 border-b">{rate.status}</td>
                        <td className="py-2 px-4 border-b">{rate.castCode}</td>
                        <td className="py-2 px-4 border-b">{rate.areaCode}</td>
                        <td className="py-2 px-4 border-b">{rate.groupCode}</td>
                        <td className="py-2 px-4 border-b">{rate.reservedRate}</td>
                        <td className="py-2 px-4 border-b">{rate.reservedCount}</td>
                        <td className="py-2 px-4 border-b">{rate.emptyCount}</td>
                        <td className="py-2 px-4 border-b">{rate.totalCount}</td>
                        <td className="py-2 px-4 border-b">{rate.isLastList ? 'Yes' : 'No'}</td>
                        <td className="py-2 px-4 border-b">{new Date(rate.createdAt).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b">{new Date(rate.updatedAt).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b">
                            <button
                                onClick={() => executeJobReservationRate(rate.id)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            >
                                実行
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                    Previous
                </button>
                <span className="py-2 px-4">
          Page {currentPage} of {totalPages}
        </span>
                <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Next
                </button>
            </div>
        </div>
    );
};