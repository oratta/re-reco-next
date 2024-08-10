let apiCache = {};

export async function fetchApi(url, method = "GET", data = null, force = false, argOptions = {}) {
    if (apiCache[url] && !force && method === "GET") {
        return apiCache[url];
    }

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
    try{
        response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}, via ${method}: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Failed to fetch ${url}, via ${method}: ${error.message}`);
    }

    const responseData = await response.json();

    if (method === "GET") {
        apiCache[url] = responseData;
    }

    return responseData;
}

export async function fetchApiForce(url, method = "GET", data = null, force = false){
    return await fetchApi(url, method, data, true, {cache: "no-store"});
}