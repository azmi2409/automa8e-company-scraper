import fastify from "fastify";
import { search } from "./scraper/uensg.js";

const token = process.env.TOKEN || "";
let keys

if (token) {
    console.log("token is set", token)
    keys = new Set([token])
}

const server = fastify({
    logger: true,
});

//check request bearer token
if (keys) {
    server.register(import("@fastify/bearer-auth"), { keys })
}

await server.register(import('@fastify/rate-limit'), {
    max: 30,
    timeWindow: '1 minute'
})

const baseAPI = "/api/v1";
const api = baseAPI + "/search";

server.get(api, async (request, reply) => {
    const query = request.query.q;
    let loadMaxPage = request.query.load_all === "true" || false;

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

    return reply.code(200).send({
        ...data
    });
})

server.get(baseAPI + "/details", async (request, reply) => {
    const company_name = request.query.company_name;
    //regex remove . and replace space with -
    const company_name_url = company_name.replace(/\s/g, '-').replace(/\./g, '').toLowerCase();
    console.log(company_name_url)

    if (!company_name || company_name.length < 4) {
        return reply.code(400).send({
            message: "Please enter a valid query (Min 4 char)"
        });
    }

    return reply.code(404).send({
        message: `company ${company_name} not found`,
        url: company_name_url
    });
}
)

//Get host and port from env
const host = process.env.SERVER_HOST || "127.0.0.1"
const port = process.env.SERVER_PORT || 4000

/**Run Server */
const start = async () => {
    try {
        await server.listen({ host, port });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
start();
