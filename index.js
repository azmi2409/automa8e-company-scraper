import { search } from "./search.js";
import { profile } from "./profile.js";
import { startBrowser } from "./startBrowser.cjs";
//get query from command
const query = process.argv[2] || 'aUtoma8e';
const URL = "https://www.sgpbusiness.com/";

async function main() {
    const browser = await startBrowser();
    console.time("log")

    const getProfile = async (URL) => {
        const data = await profile(browser, URL);
        console.log(data);
    }
    try {
        const data = await search({ browser, URL, query });
        console.log(data);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        await browser.close();
        console.timeEnd("log")
    }

}

main();