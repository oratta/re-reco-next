import {consoleError, consoleLog} from "@/commons/utils/log";
import {chromium} from "playwright";
import {getReservationUrl} from "@/features/listingCast/services/actions/domHeaven.v1";
import * as cheerio from "cheerio";

export async function scrapeReservationRate(jobReRe) {
    let browser;
    try{
        const url = getUrl(jobReRe);
        browser = await chromium.launch({headless: false});
        const page = await browser.newPage();

        // ページに移動
        consoleLog(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForLoadState('domcontentloaded');

        // iframeを見つけて、そのコンテンツにアクセス
        consoleLog('Waiting for iframe...');
        const frame = await page.frameLocator('iframe[name="pcreserveiframe"]').first();

        // consoleLog('Waiting for iframe content to load...');
        // await frame.waitForLoadState('domcontentloaded', { timeout: 60000 });

        if (!frame) {
            throw new Error('Iframe not found');
        }

        consoleLog('Checking if table exists');
        const tableExists = await frame.locator('#chart > div > table').count() > 0;
        if (!tableExists) {
            consoleLog('Table not found, dumping page content');
            const pageContent = await page.content();
            console.log(pageContent);
            throw new Error('Table not found in the iframe');
        }

        const tableHtml = await frame.locator('#chart > div > table').innerHTML();
        const $ = cheerio.load(tableHtml, {
            xml: {
                xmlMode: true,
                decodeEntities: false
            }
        });

        return  await getReservationStatus($);
    } catch(error){
        consoleError(error, "Failed to scrape reservation rate");
        throw error;
    } finally{
        if(browser){
            await browser.close();
        }
    }
}

function getUrl(jobReRe){
    return getReservationUrl(jobReRe.cast);
}

async function getReservationStatus($){
    let dashCount = 0;
    let telCount = 0;
    let circleCount = 0;
    let otherCount = 0;

    $('tbody tr td').each((_, cell) => {
        const cellText = $(cell).text().trim();
        const rowspan = parseInt($(cell).attr('rowspan')) || 1;

        // rowspan-single属性がある場合は1としてカウント
        const count = rowspan ? 1 : rowspan;

        if (cellText === '‐') {
            dashCount += count;
        } else if (cellText === 'TEL') {
            telCount += count;
        } else if (cellText.includes('○')) {
            circleCount += count;
        } else {
            otherCount += count;
        }
    });

    //telは予約の有無が判断できないので除外
    return {
        totalCount: circleCount+otherCount,
        reservedCount: otherCount,
        emptyCount: circleCount
    };
}