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


/**Run Server */
const start = async () => {
    try {
        await server.listen({ host: '0.0.0.0', port: 4000 });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
start();
