import {scrapeCastListInfo} from "@/features/listingCast/services/actions/scrapeAndSaveReserveInfo";
import {getQuery} from "@/commons/utils/cheerioUtil";
import * as Area from "@/commons/models/Area";
import {format} from "date-fns";

export const FLAG_IS_NOW = 'Now';

export async function getJobListInfo(url){
    const $ = await getQuery(url);
    const {areaName, listSize} = scrapeCastListInfo($);
    const {areaCodes, targetDate,isNow} = parseUrl(url);

    return {
        areaName,
        areaCodes,
        targetDate: isNow ? FLAG_IS_NOW : targetDate,
        listSize
    }
}

export async function areasCreateIfNot(areaName, areaCodes){
    if (areaCodes.length === 0) {
        return true;
    } else if (areaCodes.length === 1) {
        await Area.createIfNot({name: areaName, code: areaCodes[0]});
    } else {
        for(const areaCode of areaCodes){
            const urlForScrapeAreaName = `https://www.cityheaven.net/${areaCode}`;
            const {areaName} = scrapeCastListInfo(await getQuery(urlForScrapeAreaName));
            if(areaName === ''){
                throw new Error('Failed to get area name');
            }
            await Area.createIfNot({areaCode, areaName});
        }
    }
}

export function parseUrl(url) {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

    const areaCodes = [];
    let targetDate = '';
    let isNow = false;

    // Extract area codes
    const areaCodeParts = pathParts.slice(0, 3);
    const baseAreaCode = areaCodeParts.join('/');
    if (areaCodeParts.length === 3) {
        const lastPart = areaCodeParts[2];
        if (lastPart.includes('-')) {
            // Handle multiple area codes
            const subAreas = lastPart.split('-');
            subAreas.forEach(subArea => {
                areaCodes.push(`${areaCodeParts[0]}/${areaCodeParts[1]}/${subArea}`);
            });
        } else {
            areaCodes.push(baseAreaCode);
        }
    }

    // Check for invalid additional area code
    if (pathParts[3] && pathParts[3].startsWith('A')) {
        throw new Error('invalid area code format');
    }

    // Extract date or set to current date if not present
    const datePart = pathParts.find(part => part.startsWith('date'));
    if (datePart) {
        targetDate = datePart.slice(4); // Remove 'date' prefix
        isNow = false;
    } else {
        const playPart = pathParts.find(part => part.startsWith('play'));
        if (playPart) {
            targetDate = format(new Date(), 'yyyyMMdd');
            isNow = true;
        } else {
            throw new Error('you have to set play date or setting Now');
        }
    }

    return {
        areaCodes,
        targetDate,
        isNow,
        condition: url,
        areaCode: baseAreaCode,
    };
}

