import { search } from "./search.js";
import { profile } from "./profile.js";
//get query from command
const query = process.argv[2] || 'aUtoma8e';
const URL = "https://www.sgpbusiness.com/";

async function main(withDetails = false) {
    let listOfCompany = [];
    let datas = []
    console.time("log");
    // const getProfile = async (URL) => {
    //     const data = await profile(browser, URL);
    //     return data;
    // }
    try {
        datas = await search({ URL, query });
        // if (withDetails) {
        //     let i = 0;
        //     for (const data of datas) {
        //         const company = await getProfile(data.link);
        //         if (company?.UEN) {
        //             datas[i].details = company;
        //         }
        //         i++;
        //     }
        // }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        console.log(datas)
        console.timeEnd("log")
        return datas
    }

}

if (query.length >= 4) {
    main();
} else {
    console.log("Please enter a valid query (Min 4 char)");
}