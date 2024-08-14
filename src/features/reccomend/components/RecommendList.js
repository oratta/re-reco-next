import React, {useEffect, useState} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CalendarIcon } from '@heroicons/react/24/solid';

export default function RecommendList({ data, category, onLoadMore, hasMore }) {
    const [selectedTab, setSelectedTab] = useState('Recent');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const sortedData = [...data].sort((a, b) => {
        switch (selectedTab) {
            case 'Recent':
                return b.recent1ReservationRate - a.recent1ReservationRate;
            case 'Recent5':
                return b.recent5ReservationRate - a.recent5ReservationRate;
            case 'Recent30days':
                return b.recent30daysReservationRate - a.recent30daysReservationRate;
            case 'Total':
                return b.totalReservationRate - a.totalReservationRate;
            default:
                return 0;
        }
    });

    useEffect(() => {
        console.log('SuccessDialog: isOpen changed to', isOpen);
    }, [isOpen]);

    function closeModal() {
        setIsOpen(false)
    }

    function openModal(item) {
        setSelectedItem(item);
        console.log(item);
        setIsOpen(true)
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-4">
                {['Recent', 'Recent5', 'Recent30days', 'Total'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded ${selectedTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">総予約率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">直近予約率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">直近5回予約率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">直近30日予約率</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item) => (
                    <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap cursor-pointer text-blue-600 hover:text-blue-800" onClick={() => openModal(item)}>{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{(item.totalReservationRate * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">{(item.recent1ReservationRate * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">{(item.recent5ReservationRate * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">{(item.recent30daysReservationRate * 100).toFixed(2)}%</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {hasMore && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onLoadMore}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        次へ
                    </button>
                </div>
            )}

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    {selectedItem && (
                                        <>
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                {selectedItem.name}の詳細情報
                                            </Dialog.Title>
                                            <div className="mt-2 flex space-x-1">
                                                <div className="w-1/2">
                                                    <img src={selectedItem.thumbnailUrl} alt={selectedItem.name}
                                                         className="h-64 object-cover rounded-lg"/>
                                                </div>
                                                <div className="w-1/2">
                                                    <p className="text-sm text-gray-500 mt-2">年齢: {selectedItem.age}歳</p>
                                                    <p className="text-sm text-gray-500">身長: {selectedItem.height}cm</p>
                                                    <p className="text-sm text-gray-500">スタイル: {selectedItem.bust}({selectedItem.cup})-{selectedItem.waist}-{selectedItem.hip}</p>
                                                    <p className="text-sm text-gray-500">グループコード: {selectedItem.groupCode}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <a
                                                    href={selectedItem.reservationUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <CalendarIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                                                    予約する
                                                </a>
                                            </div>
                                        </>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}