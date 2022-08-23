import * as cheerio from "cheerio";
import { browser } from "./phantomcloud.js";
import { profile } from "./profile.js";

async function search({ URL, query, withDetails }) {
    const pageUrl = {
        url: `${URL}search?q=${query}`,
        renderType: "html",
    }
    const res = await browser.requestSingle(pageUrl);
    const body = res.content.data;

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

    if (data.length === 0) {
        console.log('No result found', $.html());
    }

    // const arrayOfLink = filteredData.map(({ link }) => link);
    // const batch = await new Promise.all(browser.requestBatch({
    //     urls: arrayOfLink,
    // }));
    // console.log(batch);
    return filteredData;

}

export { search };