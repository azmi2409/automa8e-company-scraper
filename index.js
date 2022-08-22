import { search } from "./search.js";
import { profile } from "./profile.js";
import { startBrowser } from "./startBrowser.cjs";
//get query from command
const query = process.argv[2] || 'aUtoma8e';
const URL = "https://www.sgpbusiness.com";

async function main() {
    const browser = await startBrowser();

    const getProfile = async (URL) => {
        const data = await profile(browser, URL);
        console.log(data);
    }

    search({ browser, URL, query }).then(async (data) => {
        for (const el of data) {
            const item = await getProfile(el.link)
        }
    }).finally(() => browser.close())

}

main();