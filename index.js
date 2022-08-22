import { search } from "./search.js";
//get query from command
const query = process.argv[2] || 'aUtoma8e';
const URL = "https://www.sgpbusiness.com";

search({ URL, query }).then(data => console.log(data)).finally(() => console.log("Done"));