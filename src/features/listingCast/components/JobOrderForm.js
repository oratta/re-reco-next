'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from "@/commons/utils/api";
import { DATE_RANGE_DAYS } from "@/configs/appSetting";
import formSubmit from "./formSubmit";

export default function JobOrderForm({areas, onSubmit}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + DATE_RANGE_DAYS);

    const [formData, setFormData] = useState({
        areaId: '',
        targetDate: today.toISOString().split('T')[0],
        condition: ''
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
                <label htmlFor="areaId" className="block text-sm font-medium text-gray-700">
                    Area
                </label>
                <select
                    id="areaId"
                    name="areaId"
                    value={formData.areaId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">select...</option>
                    {areas.map((area) => (
                        <option key={area.id} value={area.id}>{area.name}</option>
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
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">条件</label>
                <input
                    type="text"
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