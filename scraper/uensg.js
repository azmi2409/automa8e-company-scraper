import puppeteer from 'puppeteer-extra'
import * as cheerio from 'cheerio'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

const TO = process.env.SERVER_TIMEOUT || 5000

const search = async (params = 'aUtoma8e', loadMaxPage = false) => {
    puppeteer.use(StealthPlugin())

    console.time("fetch time")

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    await page.setViewport({ width: 800, height: 600 })

    await page.goto('https://www.uen.gov.sg/ueninternet/faces/pages/uenSrch.jspx', { waitUntil: 'load', timeout: TO })

    await page.waitForSelector('input[name="pt1:r1:0:it1"]')
    await page.type('input[name="pt1:r1:0:it1"]', `${params}`)
    await page.click('.uenSearchButton');

    try {
        await page.waitForSelector('span.uenlabel', { timeout: TO })
    } catch (e) {
        console.log(e)
        await browser.close()
        return []
    }


    if (loadMaxPage) {
        await page.click('select[id="pt1:r1:0:soc2::content"]')
        await page.waitForSelector('select[id="pt1:r1:0:soc2::content"] > option[value="3"]')
        await page.select('select[id="pt1:r1:0:soc2::content"]', '3')
        await page.waitForTimeout(500)
    }

    const html = await page.content()
    const $ = cheerio.load(html)

    const data = $('.af_panelFormLayout_content-cell > .af_panelGroupLayout').map((i, el) => {
        if (i > 0) {
            const label = $(el).find('span.uenlabel').map((i, el2) => {
                return $(el2).text().replace(':', '');
            }).get();
            const value = $(el).find('.bizpara1 , .bizpara2').map((i, el2) => {
                if ($(el2).text()) {
                    return $(el2).text();
                }
            }).get();

            const data = {}
            label.forEach((l, i) => {
                data[l] = value[i]
            })

            return data
        }
    }).get()

    await browser.close()
    console.timeEnd("fetch time")
    if (data.length > 0) {
        return data
    }
}

export { search }