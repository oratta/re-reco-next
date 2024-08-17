import * as Cast from "@/commons/models/Cast";
import {URL_BASE_CAST_LIST} from "@/configs/appConst";
import {consoleError, consoleLog} from "@/commons/utils/log";

export function getPagingList($){
    return  $('.shop_nav_list a')
        .not('.next')
        .map((index, element) => `${URL_BASE_CAST_LIST}${element.attribs.href}`)
        .get();
}

export function getListSize($){
    return parseInt($('#all-count_left').text(), 10);
}

export function getAreaName($){
    return $('head > title').text().replace(/の.*/,'');
}

export function getCastList($){
    return $('div.girlListFooter.main_girlListFooter.main_reserve_girlListFooter > a')
        .map((_, link) => {
            const href = link.attribs.href;
            return Cast.urlToCastData(href);
        })
        .get();
}

export function getReservationIFrameUrl(cast){
    if(!cast || !cast.areaCode || !cast.groupCode || !cast.code){
        const e = new Error("invalid cast");
        consoleError(e,cast);
        throw e;
    }
    const url = `https://yoyaku.cityheaven.net/calendar/${cast.areaCode}/${cast.groupCode}/1/${cast.code}`;
    consoleLog(url);
    return url;
}

export function getReservationUrl(cast){
    if(!cast || !cast.areaCode || !cast.groupCode || !cast.code){
        const e = new Error("invalid cast");
        consoleError(e,cast);
        throw e;
    }
    const url = `https://www.cityheaven.net/${cast.areaCode}/${cast.groupCode}/A6ShopReservation/?girl_id=${cast.code}`;
    consoleLog(`scrapingUrl: ${url}`);
    return url;
}