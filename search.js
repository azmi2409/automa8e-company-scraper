import * as cheerio from "cheerio";
import puppeteer from 'puppeteer-extra';

import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
// import { hcaptcha } from 'puppeteer-hcaptcha';

puppeteer.use(StealthPlugin());
puppeteer.use(RecaptchaPlugin());

async function search({ URL, query }) {
    const browser = await puppeteer.launch({
        headless: true,
        // executablePath: '/usr/bin/chromium-browser',
        args: ["--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-accelerated-2d-canvas",
            "--no-zygote",
            "--renderer-process-limit=1",
            "--no-first-run",
            "--ignore-certificate-errors",
            "--ignore-certificate-errors-spki-list",
            "--disable-dev-shm-usage",
            "--disable-infobars",
            "--lang=en-US,en",
            "--window-size=1920x1080",
            "--disable-extensions",],
    });
    //set user agent

    const page = await browser.newPage();
    await page.setUserAgent('Chrome/77.0.3865.90');
    await page.setJavaScriptEnabled(true);
    await page.setViewport({ width: 800, height: 600 });


    await page.goto(`${URL}search?q=${query}`);
    await page.setDefaultNavigationTimeout(0);

    // Call hcaptcha method passing in our page
    // await hcaptcha(page);
    await page.waitForTimeout(5000);
    await page.solveRecaptchas()

    const body = await page.evaluate(() => {
        return document.body.innerHTML;
    }).catch(err => {
        console.log(err);
    }
    );

    const $ = cheerio.load(body);
    console.log($.html());
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

    setTimeout(async () => {
        // await page.close();
        await browser.close();
    }
        , 100);
    return filteredData;

}

export { search };