import { useState, useEffect } from 'react';

export default function ConditionSelectForm({ category, areas, groups, onSubmit }) {
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');

    useEffect(() => {
        setSelectedGroup('');
    }, [selectedArea]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ area: selectedArea, group: selectedGroup });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">エリア</label>
                <select
                    id="area"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">選択してください</option>
                    {areas.map((area) => (
                        <option key={area.code} value={area.code}>{area.name}</option>
                    ))}
                </select>
            </div>
            {category === 'Cast' && (
                <div>
                    <label htmlFor="group" className="block text-sm font-medium text-gray-700">グループ</label>
                    <select
                        id="group"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">全て</option>
                        {groups.filter(group => !selectedArea || group.areaCode === selectedArea).map((group) => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                    </select>
                </div>
            )}
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                検索
            </button>
        </form>
    );
}