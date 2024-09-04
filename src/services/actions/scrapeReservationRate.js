import { chromium } from "playwright";
import { consoleError, consoleLog } from "@/commons/utils/log";
import { getReservationUrl } from "@/commons/libs/domHeaven.v1";
import * as cheerio from "cheerio";

export async function scrapeReservationRate(jobReRe) {
    let browser;
    try {
        const url = getUrl(jobReRe);
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });
        const page = await context.newPage();

        // Set a longer timeout
        page.setDefaultTimeout(90000);  // Increased timeout to 90 seconds

        // Navigate to the page
        consoleLog(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
        await page.waitForLoadState('domcontentloaded');

        // Wait for iframe to be available
        consoleLog('Waiting for iframe...');
        await page.waitForSelector('iframe[name="pcreserveiframe"]', { state: 'attached', timeout: 60000 });

        // Get all frames
        const frames = page.frames();
        consoleLog(`Found ${frames.length} frames`);

        // Find the correct frame
        const frame = frames.find(f => f.name() === 'pcreserveiframe');
        if (!frame) {
            throw new Error('Iframe not found');
        }

        consoleLog('Checking if table exists');
        await frame.waitForSelector('#chart > div > table', { state: 'attached', timeout: 60000 });

        const tableHtml = await frame.$eval('#chart > div > table', (table) => table.outerHTML);
        const $ = cheerio.load(tableHtml, {
            xml: {
                xmlMode: true,
                decodeEntities: false
            }
        });
        const reservationStatus = await scrapeReservationStatus($);

        let castInfo = {};
        if (jobReRe.cast) {
            if (jobReRe.cast.name) {
                consoleLog('Cast name already exists');
                consoleLog(jobReRe.cast);
            } else {
                const size = await frame.locator('body > div.wrapper > div > div > section > div.booking-wrap > div:nth-child(6) > div.radius-box.radius-box_img > table > tbody > tr:nth-child(2) > td > span').textContent();
                const baseInfo = await frame.locator('body > div.wrapper > div > div > section > div.booking-wrap > div:nth-child(6) > div.radius-box.radius-box_img > table > tbody > tr:nth-child(1) > td.second > a > strong').textContent();
                castInfo = parseInfo(baseInfo, size);
            }
        } else {
            throw new Error('Cast not found');
        }

        return {
            reservationStatus,
            castInfo
        }

    } catch (error) {
        consoleError(error, "Failed to scrape reservation rate");
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

function getUrl(jobReRe) {
    return getReservationUrl(jobReRe.cast);
}

async function scrapeReservationStatus($) {
    let dashCount = 0;
    let telCount = 0;
    let circleCount = 0;
    let otherCount = 0;

    $('tbody tr td').each((_, cell) => {
        const cellText = $(cell).text().trim();
        const rowspan = parseInt($(cell).attr('rowspan')) || 1;

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

    return {
        totalCount: circleCount + otherCount,
        reservedCount: otherCount,
        emptyCount: circleCount
    };
}

function parseInfo(baseInfo, size) {
    let regex = /(.+?)（(\d+)歳）/;
    let match = baseInfo.match(regex);
    let result = {};
    if (match) {
        const [_, name, age] = match;
        result.name = name;
        result.age = parseInt(age, 10);
    } else {
        throw new Error("Invalid input string format");
    }

    regex = /(\d+)・(\d+)\((\w)\)・(\d+)・(\d+)/;
    match = size.match(regex);

    if (match) {
        const [_, height, bust, cup, waist, hip] = match;
        return {
            ...result,
            height: parseInt(height, 10),
            bust: parseInt(bust, 10),
            cup: cup,
            waist: parseInt(waist, 10),
            hip: parseInt(hip, 10)
        };
    } else {
        throw new Error("Invalid measurement string format");
    }
}