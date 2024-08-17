import {fetchApi} from "@/commons/utils/api";

export default async function formSubmit(formData, setIsLoading) {
    console.log('Job order to be submitted:', formData);
    try {
        console.log('Stringified formData:', JSON.stringify(formData)); // この行を追加
        const response = await fetchApi("/api/job-listings", "POST", setIsLoading ,formData);
        console.log('API response:', response);
        return response;
    } catch (e) {
        console.error('Failed to submit job order:', e);
        throw e;
    }
}