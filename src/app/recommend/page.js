'use client';

import { useState } from 'react';
import CategoryTab from './CategoryTab';
import ConditionSelectForm from './ConditionSelectForm';
import RecommendList from './RecommendList';

export default function RecommendView() {
    const [selectedCategory, setSelectedCategory] = useState('Group');
    const [selectedCondition, setSelectedCondition] = useState({});
    const [recommendData, setRecommendData] = useState([]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedCondition({});
        setRecommendData([]);
    };

    const handleConditionSubmit = async (condition) => {
        setSelectedCondition(condition);
        // TODO: API呼び出しを実装してrecommendDataを更新
        // この例では、ダミーデータを使用します
        setRecommendData([
            { id: '1', name: 'Item 1', totalReservationRate: 0.8, recent1ReservationRate: 0.9, recent5ReservationRate: 0.85, recent30daysReservationRate: 0.82 },
            { id: '2', name: 'Item 2', totalReservationRate: 0.7, recent1ReservationRate: 0.8, recent5ReservationRate: 0.75, recent30daysReservationRate: 0.72 },
        ]);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">レコメンド</h1>
            <CategoryTab selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
            <ConditionSelectForm category={selectedCategory} onSubmit={handleConditionSubmit} />
            <RecommendList data={recommendData} category={selectedCategory} />
        </div>
    );
}