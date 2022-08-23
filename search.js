import * as cheerio from "cheerio";
import { startBrowser } from "./startBrowser.cjs";

async function search({ browser, URL, query }) {
    const page = await browser.newPage();

    await page.goto(`${URL}search?q=${query}`);
    await page.waitForTimeout(1000);

    const body = await page.evaluate(() => {
        return document.body.innerHTML;
    }).catch(err => {
        console.log(err);
    }
    );

    const $ = cheerio.load(body);
    const data = $('.list-group').children().map((i, el) => {
        const text = $(el).find('.text-nowrap').map((i, el2) => {
            return $(el2).text();
        }).get();
        return {
            title: $(el).find('.list-group-item-heading').text(),
            status: text[0]?.trim() ?? '',
            uen: text[1]?.replace('UEN: ', '')?.trim() ?? '',
            address: text[2]?.trim() ?? '',
            link: URL + ($(el).attr('href') ?? ''),
        }
    }).get();

    const filteredData = data.filter(({ status }) => status !== '');

    setTimeout(() => {
        page.close();
    }
        , 100);
    return filteredData;

}

export { search };