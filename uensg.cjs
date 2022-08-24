const puppeteer = require('puppeteer-extra')
const cheerio = require('cheerio')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

puppeteer.launch({ headless: true }).then(async browser => {
    console.time("fetch time")
    const page = await browser.newPage()
    await page.setViewport({ width: 800, height: 600 })

    await page.goto('https://www.uen.gov.sg/ueninternet/faces/pages/uenSrch.jspx', { waitUntil: 'load', timeout: 0 })
    // await page.type('.af_inputText_content', 'aUtoma8e')
    // await page.click('#pt1:r1:0:cBT')

    await page.waitForSelector('input[name="pt1:r1:0:it1"]')
    await page.$eval('input[name="pt1:r1:0:it1"]', el => el.value = '202111336N')
    await page.click('.uenSearchButton');

    await page.waitForTimeout(2000)
    await page.waitForSelector('.af_panelFormLayout_content-cell')

    const html = await page.content()
    const $ = cheerio.load(html)
    console.log($('span.uenlabel').text())
    console.log($('.bizpara1').text())

    await browser.close()
    console.timeEnd("fetch time")
})