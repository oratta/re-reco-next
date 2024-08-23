import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from "next/image";
import { CheckCircle, XCircle } from 'lucide-react';

export default function ConfirmOrderModal({ isOpen, onClose, onConfirm, areaName, targetDate, count, isValidOrder, status, statusMessage }) {
    const isConfirmState = status === 'confirm';
    const isSuccessState = status === 'success';
    const isErrorState = status === 'error';

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                                <div className="flex mb-4 space-x-10">
                                    <div className="w-1/4 mx-2">
                                        <Image src="/concierge.png" alt="Concierge" width={48} height={48}/>
                                    </div>
                                    <div>
                                        <div className="text-center">
                                            <p className="text-lg font-semibold">{areaName}</p>
                                            <p className="text-sm text-gray-500">{targetDate}</p>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-2xl font-bold text-center">{count}</p>
                                            {isConfirmState && isValidOrder && (
                                                <p className="text-center text-gray-600">casts is available</p>
                                            )}
                                            {isConfirmState && !isValidOrder && (
                                                <p className="text-red-500 text-sm mb-4">The number of casts exceeds the limit or 0</p>
                                            )}
                                            {(isSuccessState || isErrorState) && (
                                                <p className={`text-center ${isSuccessState ? 'text-green-600' : 'text-red-600'}`}>
                                                    {statusMessage}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mt-4 flex justify-center">
                                            {isConfirmState ? (
                                                <button
                                                    type="button"
                                                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                                                        isValidOrder
                                                            ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    onClick={onConfirm}
                                                    disabled={!isValidOrder}
                                                >
                                                    Create Order
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                    onClick={onClose}
                                                >
                                                    Close
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {(isSuccessState || isErrorState) && (
                                    <div className="mt-4 flex justify-center">
                                        {isSuccessState ? (
                                            <CheckCircle className="text-green-500" size={48} />
                                        ) : (
                                            <XCircle className="text-red-500" size={48} />
                                        )}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}