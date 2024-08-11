import {useState} from 'react';

export default function RecommendList({ data, category, onLoadMore, hasMore }) {
    const [selectedTab, setSelectedTab] = useState('Recent');

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
                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
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
        </div>
    );
}