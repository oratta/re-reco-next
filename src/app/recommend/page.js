'use client';

import { useState, useEffect } from 'react';
import CategoryTab from './CategoryTab';
import ConditionSelectForm from './ConditionSelectForm';
import RecommendList from './RecommendList';
import JobListingSelect from './JobListingSelect';
import { fetchApi} from '@/lib/api';

export default function RecommendView() {
    const [selectedCategory, setSelectedCategory] = useState('Group');
    const [areas, setAreas] = useState([]);
    const [groups, setGroups] = useState([]);
    const [jobListings, setJobListings] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState({});
    const [recommendData, setRecommendData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchInitialData = async () => {
            const areasData = await fetchApi('/api/areas');
            setAreas(areasData);
            const groupsData = await fetchApi('/api/groups');
            setGroups(groupsData);
            const jobListingsData = await fetchApi('/api/job-listings');
            setJobListings(jobListingsData);
        };
        fetchInitialData();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedCondition({});
        setRecommendData([]);
        setCurrentPage(1);
    };

    const handleConditionSubmit = async (condition) => {
        setSelectedCondition(condition);
        // TODO: API呼び出しを実装してrecommendDataを更新
        // この例では、ダミーデータを使用します
        const dummyData = [
            { id: '1', name: 'Item 1', totalReservationRate: 0.8, recent1ReservationRate: 0.9, recent5ReservationRate: 0.85, recent30daysReservationRate: 0.82 },
            { id: '2', name: 'Item 2', totalReservationRate: 0.7, recent1ReservationRate: 0.8, recent5ReservationRate: 0.75, recent30daysReservationRate: 0.72 },
        ];
        setRecommendData(dummyData);
        setCurrentPage(1);
    };

    const loadMoreData = async () => {
        // TODO: API呼び出しを実装して追加のデータをロード
        // この例では、ダミーデータを追加します
        const moreData = [
            { id: '3', name: 'Item 3', totalReservationRate: 0.75, recent1ReservationRate: 0.85, recent5ReservationRate: 0.8, recent30daysReservationRate: 0.77 },
            { id: '4', name: 'Item 4', totalReservationRate: 0.65, recent1ReservationRate: 0.7, recent5ReservationRate: 0.68, recent30daysReservationRate: 0.67 },
        ];
        setRecommendData(prevData => [...prevData, ...moreData]);
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">レコメンド</h1>
            <CategoryTab selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
            {selectedCategory === 'Job_Listing' ? (
                <JobListingSelect jobListings={jobListings} onSubmit={handleConditionSubmit} />
            ) : (
                <ConditionSelectForm
                    category={selectedCategory}
                    areas={areas}
                    groups={groups}
                    onSubmit={handleConditionSubmit}
                />
            )}
            <RecommendList
                data={recommendData}
                category={selectedCategory}
                onLoadMore={loadMoreData}
                hasMore={currentPage < 3} // 例として、3ページまでとします
            />
        </div>
    );
}