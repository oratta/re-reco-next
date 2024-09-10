'use client';

import {useEffect, useState} from 'react';
import CategoryTab from '@/app/recommend/CategoryTab';
import ConditionSelectForm from '@/app/recommend/ConditionSelectForm';
import RecommendList from '@/app/recommend/RecommendList';
import {fetchApi} from '@/commons/utils/api';
import {useAreas} from "@/commons/components/contexts/AreasContext";
import {useLoadingSetter} from "@/commons/components/contexts/LoadingContext";
import SelectJobListing from "@/app/recommend/SelectJobListing";

export default function RecommendView() {
    const [selectedCategory, setSelectedCategory] = useState('Job_Listing');
    const areas = useAreas();
    const [groups, setGroups] = useState([{
        name: "先にエリアを選択してください",
        id: "",
        areaCode: "",
    }]);
    const [jobListings, setJobListings] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState({});
    const [recommendData, setRecommendData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const setIsLoading = useLoadingSetter();

    useEffect(() => {
        const fetchInitialData = async () => {
            setJobListings(await fetchApi('/api/job-listings?type=listing', 'GET', setIsLoading));
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
        const params = new URLSearchParams();
        params.append("mode", selectedCategory.toLowerCase());  // Group=>group, Cast=>cast
        if (condition.area) {
            params.append("areaCode", condition.area);
        }
        if (condition.group) {
            params.append("groupCode", condition.group.code);
        }

        const data = await fetchApi('/api/casts?' + params.toString(), 'GET', setIsLoading);
        setRecommendData(data);
        setCurrentPage(1);
    };

    const handleChangeAreas = async (areaCode) => {
        const groups = await fetchApi(`/api/groups?areaCode=${areaCode}`, 'GET', setIsLoading);
        console.log(groups);
        setGroups(groups);
    };

    const loadMoreData = async () => {
        // TODO: API呼び出しを実装して追加のデータをロード
        // この例では、ダミーデータを追加します
        const moreData = await fetchApi(`/api/casts?page=${currentPage + 1}`, 'GET', setIsLoading);
        setRecommendData(prevData => [...prevData, ...moreData]);
        setCurrentPage(prevPage => prevPage + 1);
    };

    const searchWithJobListing = async (jobListingId) => {
        console.log("jobSelect");
        const data = await fetchApi(`/api/job-listings/${jobListingId}/job-reservation-rates?as=cast`, 'GET', setIsLoading);
        console.log(data);
        setRecommendData(data);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Recommend</h1>
            <CategoryTab selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
            {selectedCategory === 'Job_Listing' ? (
                <SelectJobListing
                    areas={areas}
                    jobListings={jobListings}
                    onSearch={searchWithJobListing}
                />
            ) : (
                <ConditionSelectForm
                    category={selectedCategory}
                    areas={areas}
                    groups={groups}
                    changeAreas={handleChangeAreas}
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