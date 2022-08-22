import { search } from "./search.js";
import { profile } from "./profile.js";
import { startBrowser } from "./startBrowser.cjs";
//get query from command
const query = process.argv[2] || 'aUtoma8e';
const URL = "https://www.sgpbusiness.com/";

async function main() {
    const browser = await startBrowser();

    const getProfile = async (URL) => {
        const data = await profile(browser, URL);
        console.log(data);
    }
    try {
        const data = await search({ browser, URL, query });
        console.log(data);
        await getProfile(data[0].link);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        await browser.close();
    }

}

main();