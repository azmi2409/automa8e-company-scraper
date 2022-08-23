import { search } from "./search.js";
import { profile } from "./profile.js";
//get query from command
const query = process.argv[2] || 'aUtoma8e';
const URL = "https://www.sgpbusiness.com/";

async function main(withDetails = false) {
    let listOfCompany = [];
    let datas = []
    console.time("time elapsed");
    try {
        datas = await search({ URL, query, withDetails });
    }
    catch (err) {
        console.log(err);
    }
    finally {
        console.log(datas)
        console.timeEnd("time elapsed")
        return datas
    }

}

if (query.length >= 4) {
    main();
} else {
    console.log("Please enter a valid query (Min 4 char)");
}