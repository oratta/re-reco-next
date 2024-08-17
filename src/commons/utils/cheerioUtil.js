import * as cheerio from "cheerio";

export async function getQuery(url) {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    };

    try {
        const response = await fetch(url, { headers });

        // Check if the response status is not in the successful range (200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        return cheerio.load(html);
    } catch (error) {
        // Catch any errors (network errors, HTTP errors, etc.) and throw a new error with more context
        throw new Error(`Failed to fetch and parse URL (${url}): ${error.message}`);
    }
}