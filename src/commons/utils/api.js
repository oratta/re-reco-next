import {useLoadingSetter} from "@/commons/components/contexts/LoadingContext";

export async function fetchApi(url, method = "GET", setIsLoading=()=>{}, data = null, argOptions = {}) {
    try {
        setIsLoading(true);
        const options = {
            ...argOptions,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
            options.body = JSON.stringify(data);
        }

        let response = null;
        try {
            response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}, via ${method}: ${response.statusText}`);
            }
        } catch (error) {
            throw new Error(`Failed to fetch ${url}, via ${method}: ${error.message}`);
        }

        const responseData = await response.json();

        return responseData;
    } finally {
        setIsLoading(false);
    }
}

export async function fetchApiForce(url, method = "GET", setIsLoading=()=>{}, data = null){
    return await fetchApi(url, method,setIsLoading, data, {cache: "no-store"});
}

export function getWebParameter(req, params) {
    const url = new URL(req.url);

    let result = {};
    if (typeof params === 'string') {
        result[params] = url.searchParams.get(params) || null;
    } else if (Array.isArray(params) && params.every(param => typeof param === 'string')) {
        params.forEach(param => result[param] = url.searchParams.get(param) || null);
    } else if (typeof params === 'object' && Object.values(params).every(value => typeof value === 'string')) {
        for (let key in params) {
            if (typeof params[key] === 'string') {
                result[params[key]] = url.searchParams.get(params[key]) || null;
            }
        }
    } else {
        throw new Error("'params' must be a string, a string array, or an object containing string values.");
    }
    return result;
}