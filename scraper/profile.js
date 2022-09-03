import * as cheerio from "cheerio";
import { browser } from "./phantomcloud.js";
const URL = 'https://www.sgpbusiness.com/company/'
async function profile(query) {
    //TODO: get profile data from URL
    const pageUrl = {
        url: `${URL}${query}`,
        renderType: "html",
    }

    const res = await browser.requestSingle(pageUrl);
    const body = res.content.data;

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

    const data = [...profile, ...contact, ...industry].reduce((acc, curr) => ({ ...acc, ...curr }), {});
    return data;
}

export { profile };