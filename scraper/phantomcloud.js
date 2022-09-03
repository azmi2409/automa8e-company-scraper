import * as phantomJsCloud from "phantomjscloud";

const apiKey = process.env.PHANTOMCLOUD_API_KEY;
const browser = new phantomJsCloud.BrowserApi(apiKey);

export {
    browser,
}