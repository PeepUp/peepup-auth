import type { FastifyReply, FastifyRequest } from "fastify";

export async function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(404).send({
        ok: false,
        message: "Resource or Service Not Found!",
        path: request.url,
        docs: "http://localhost:3000",
        api_docs: "http://localhost:4334/api-docs",
        response_time: reply.getResponseTime(),
    });
}
