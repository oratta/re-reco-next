'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

const CreateOrder = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [isJumped, setIsJumped] = useState(false);
    const [isJustNow, setIsJustNow] = useState(false);

    const handleCheckClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setOrderList([...orderList, { id: Date.now(), name: 'New Order' }]);
    };

    const handleJump = () => {
        setIsJumped(true);
        const baseUrl = 'https://www.cityheaven.net/tokyo/girl-list/typ102-typ103-typ202-typ203-typ204-typ304-typ305-typ306-typ307';
        const url = isJustNow ? baseUrl + 'play1-play10-play20-play30/' : baseUrl;
        window.open(url, '_blank');
    };

    return (
        <div className="p-4 max-w-md mx-auto">
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
                    <>
                        <input type="text" placeholder="paste url" className="w-full border p-2 rounded-md"/>
                        <div className="flex justify-end items-center space-x-2">
                            <MessageCircle size={24}/>
                            <button onClick={handleCheckClick} className="bg-green-500 text-white px-4 py-2 rounded-md">Check</button>
                        </div>
                    </>
                )}
                {orderList.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Order List</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {orderList.map((order) => (
                                <div key={order.id} className="border p-2 rounded-md">{order.name}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                    {/* Modal content remains unchanged */}
                </Dialog>
            </Transition>
        </div>
    );
};

export default CreateOrder;