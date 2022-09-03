import fastify from "fastify";
import { mainSearch, details } from "./services.js";

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

server.get(api, mainSearch)

server.get(baseAPI + "/details", details)

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
