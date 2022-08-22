import * as cheerio from "cheerio";
import { startBrowser } from "./startBrowser.cjs";

async function profile(browser, URL) {
    //TODO: get profile data from URL
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
    await page.goto(URL);

    const body = await page.evaluate(() => {
        return document.body.innerHTML;
    }).catch(err => {
        console.log(err);
    }
    );

    const $ = cheerio.load(body);
    const data = {
        title: $('h1.card-title').text(),
    }

    return data;
}

export { profile };