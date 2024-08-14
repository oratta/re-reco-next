'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from "@/commons/utils/api";
import { DATE_RANGE_DAYS } from "@/configs/appSetting";
import formSubmit from "./actions/formSubmit";

import {formatDate} from "date-fns";

export default function JobOrderForm({areas, onSubmit}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + DATE_RANGE_DAYS);;

    const [formData, setFormData] = useState({
        areaCode: '',
        targetDate: formatDate(new Date(), 'yyyy-MM-dd'),
        // condition: 'girl-list/biz6/typ101-typ102-typ103-typ202-typ203-typ304-typ305-typ306-typ307-typ308'
        condition: 'girl-list/biz6/typ102-typ202-typ203-typ306-typ307'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        formSubmit(formData);
        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="areaCode" className="block text-sm font-medium text-gray-700">
                    Area
                </label>
                <select
                    id="areaCode"
                    name="areaCode"
                    value={formData.areaCode}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">select...</option>
                    {areas.map((area) => (
                        <option key={area.code} value={area.code}>{area.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">targetDate</label>
                <input
                    type="date"
                    id="targetDate"
                    name="targetDate"
                    required
                    value={formData.targetDate}
                    onChange={handleChange}
                    min={today.toISOString().split('T')[0]}
                    max={maxDate.toISOString().split('T')[0]}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
            </div>
            <div>
                <input
                    type="hidden"
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
            </div>
            <button type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                JobOrder
            </button>
        </form>
    );
}