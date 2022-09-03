import { search } from "./scraper/uensg.js";
import { profile } from "./scraper/profile.js";

async function details(request, reply) {
    const company_name = request.query.company_name;
    //regex remove . and replace space with -
    const company_name_url = company_name.replace(/\s/g, '-').replace(/\./g, '').toLowerCase();
    console.log(company_name_url)

    if (!company_name || company_name.length < 4) {
        return reply.code(400).send({
            message: "Please enter a valid query (Min 4 char)"
        });
    }

    const data = await profile(company_name_url);

    if (!data || data.length === 0) {
        return reply.code(404).send({
            message: `company ${company_name} not found`,
            url: company_name_url
        });
    }
    return reply.code(200).send({
        ...data
    });
}

async function mainSearch(request, reply) {
    const query = request.query.q;
    let loadMaxPage = request.query.load_all === "true" || false;
    let withDetails = request.query.with_details === "true" || false;

    if (!query || query.length < 4) {
        return reply.code(400).send({
            message: "Please enter a valid query (Min 4 char)"
        });
    }
    const data = await search(query, loadMaxPage);

    if (!data || data.length === 0) {
        return reply.code(404).send({
            message: "No results found"
        });
    }

    let details = []

    if (withDetails && data.length === 1) {
        const company_name_url = data[0]?.["Entity Name"]?.replace(/\s/g, '-').replace(/\./g, '').toLowerCase();
        details = await profile(company_name_url);
        return reply.code(200).send({
            ...data,
            ...details
        });
    }

    return reply.code(200).send({
        ...data
    });
}

export {
    mainSearch,
    details
}