const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

async function startBrowser() {
	let browser;
	puppeteer.use(StealthPlugin());
	try {
		console.log("Opening the browser......");
		browser = await puppeteer.launch({
			headless: true,
			timeout: 0,
			args: ["--disable-setuid-sandbox", "--no-sandbox"],
			'ignoreHTTPSErrors': true
		});
	} catch (err) {
		console.log("Could not create a browser instance => : ", err);
	}
	return browser;
}

module.exports = {
	startBrowser
};