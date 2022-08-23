import * as cheerio from "cheerio";
import { startBrowser } from "./startBrowser.cjs";

async function profile(browser, URL) {
    //TODO: get profile data from URL
    const page = await browser.newPage();

    await page.goto(URL);
    await page.waitForTimeout(1000);

    const body = await page.evaluate(() => {
        const docs = document.body.innerHTML;
        return document.body.innerHTML;
    }).catch(err => {
        console.log(err);
    }
    );

    const $ = cheerio.load(body);
    let profile = $('#Corporate-Profile')?.children()?.find('.list-group-horizontal-lg > li')?.map((i, el) => {
        const elm = cheerio.load(el)
        elm('small').remove();
        const label = elm('label').text();
        const value = elm('.d-block > span').text().trim();
        return {
            [label]: value
        }
    }).get();

    const contact = $('#Contact-Information')?.children()?.find('.list-group-item')?.map((i, el) => {
        const elm = cheerio.load(el)
        elm('small').remove();
        const label = elm('label').text();
        const value = elm('.d-block > span').text().trim();
        return {
            [label]: value
        }
    }).get();

    const industry = $('#Company-Industry')?.children()?.find('.list-group-horizontal-lg > li')?.map((i, el) => {
        const elm = cheerio.load(el)
        elm('small').remove();
        const label = elm('label').text();
        const value = elm('span').text().trim();
        return {
            [label]: value
        }
    }).get();

    setTimeout(() => {
        page.close();
    }
        , 300);

    const data = [...profile, ...contact, ...industry].reduce((acc, curr) => ({ ...acc, ...curr }), {});
    return data;
}

export { profile };