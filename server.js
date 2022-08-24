import fastify from "fastify";
import { search } from "./scraper/uensg.js";

const server = fastify({
    logger: true,
});

const baseAPI = "/api/v1";
const api = baseAPI + "/search";

server.get(api, async (request, reply) => {
    const query = request.query.q;
    if (query.length < 4) {
        return reply.code(400).send({
            message: "Please enter a valid query (Min 4 char)"
        });
    }
    const data = await search(query);
    return reply.code(200).send({
        ...data
    });
})

//Get host and port from env
const host = process.env.HOST || "127.0.0.1"
const port = process.env.PORT || 4000

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
