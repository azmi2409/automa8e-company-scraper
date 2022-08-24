import search from "./uensg.cjs";
import { profile } from "./profile.js";
//get query from command
const query = process.argv[2] || 'aUtoma8e';
const URL = "https://www.sgpbusiness.com/";

async function main(withDetails = false) {
    try {
        const data = await search(query);
        return data;
    }
    catch (err) {
        console.log(err);
    }

}

if (query.length >= 4) {
    main();
} else {
    console.log("Please enter a valid query (Min 4 char)");
}