/* eslint-disable class-methods-use-this */

import type { RequestHandler } from "@/types/types";
import openapi from "../../application/config/openapi.json";

class MetadataHandler {
    alive: RequestHandler = async (_, reply) =>
        reply.send({
            status: "ok",
        });

    docs: RequestHandler = async (_, reply) => {
        const clientUrl = process.env.CLIENT_URL || "http://127.0.0.1:3000";

        return reply.code(200).send({
            docs: `${clientUrl}/docs`,
            openapi: `${clientUrl}/openapi`,
        });
    };

    ready: RequestHandler = async (_, reply) =>
        reply.code(200).send({
            status: "ok",
        });

    health: RequestHandler = async (_, reply) =>
        reply.code(200).send({
            status: "ok",
        });

    version: RequestHandler = async (_, reply) =>
        reply.code(200).send({
            version: "1.0.0",
        });

    openapi: RequestHandler = async (_, reply) => reply.code(200).send(openapi);
}

export default MetadataHandler;
