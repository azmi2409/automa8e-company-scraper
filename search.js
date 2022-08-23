import * as cheerio from "cheerio";
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import randomUseragent from 'random-useragent';
import { profile } from "./profile.js";

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

puppeteer.use(StealthPlugin());
puppeteer.use(RecaptchaPlugin({
    provider: {
        id: '2captcha',
        token: 'e490bfc9e1c8a112e496ceb2683ac3a7' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    },
    visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
}));

async function search({ URL, query, withDetails }) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
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
            "--disable-extensions",],
    });
    console.log("Opening the browser......");
    //set user agent

    const page = await browser.newPage();
    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;

    //Randomize viewport size
    await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });

    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);

    await page.goto(`${URL}search?q=${query}`, { waitUntil: 'networkidle0' });

    await page.waitForTimeout(1000);
    console.log("Cracking Captcha......");
    await page.solveRecaptchas();
    await page.waitForTimeout(1000);
    console.log("Scraping the page......");

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

    setTimeout(async () => {
        // await page.close();
        await browser.close();
    }
        , 100);
    return filteredData;

}

export { search };