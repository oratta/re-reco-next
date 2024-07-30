let apiCache = {};

export async function fetchApi(url, force=false){
    if(apiCache[url]&&!force){
        return apiCache[url];
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch areas');
    }
    const data = await response.json();
    apiCache[url] = data;
    return data;
}