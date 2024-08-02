import * as Cast from "@/commons/models/Cast";
import {URL_BASE_CAST_LIST} from "@/configs/appConst";

export function getPagingList($){
    return  $('.shop_nav_list a')
        .not('.next')
        .map((index, element) => `${URL_BASE_CAST_LIST}${element.attribs.href}`)
        .get();
}

export function getListSize($){
    return parseInt($('#all-count_left').text(), 10);
}

export function getCastList($){
    return $('div.girlListFooter.main_girlListFooter.main_reserve_girlListFooter > a')
        .map((_, link) => {
            const href = link.attribs.href;
            return Cast.urlToCastData(href);
        })
        .get();
}