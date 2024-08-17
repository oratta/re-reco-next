import {NextResponse} from "next/server";
import {consoleError} from "@/commons/utils/log";
import {areasCreateIfNot, getJobListInfo} from "@/app/api/job-listings/confirm/confirmJobList";
import {MAX_CAST_LIST_SIZE} from "@/configs/appSetting";

export async function POST(request) {
    try {
        // リクエストボディを一度だけ読み取り、変数に保存
        const body = await request.json();
        const { url } = body;

        validateUrl(url);
        const {areaName, areaCodes, targetDate, listSize } = await getJobListInfo(url);
        await areasCreateIfNot(areaName, areaCodes);

        return NextResponse.json({
            areaName,
            targetDate,
            listSize,
            isValid: listSize < MAX_CAST_LIST_SIZE ? true : false
        }, { status: 200 });
    } catch (error) {
        consoleError(error,'Failed to confirm Job List' );
        return NextResponse.json({ error: 'Failed to confirm Job List', details: error.message }, { status: 500 });
    }
}

class UrlValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UrlValidationError';
    }
}

export function validateUrl(url) {
    // Check if the URL is not empty
    if (!url || url.trim() === '') {
        throw new UrlValidationError('URL cannot be empty');
    }

    try {
        // Check if it's a valid URL
        new URL(url);
    } catch (error) {
        throw new UrlValidationError('Invalid URL format');
    }

    // Check if it contains 'cityheaven.net' and 'girl-list'
    if (!url.includes('cityheaven.net') || !url.includes('girl-list')) {
        throw new UrlValidationError('Invalid URL format2');
    }

    // Check if it contains '/play*' or '/date*'
    if (!/\/(play|date)/.test(url)) {
        throw new UrlValidationError('you have to set play date or setting Now');
    }

    // Check if it contains '/A(数字4つ)/A(数字6つ)'
    if (!/\/A\d{4}\/A\d{6}/.test(url)) {
        throw new UrlValidationError('you have to set an area detail');
    }

    // If all checks pass, return true
    return true;
}