import type { RequestHandler } from "@/types/types";

import { clientURL, serverURL } from "@/common/constant";
import openapi from "@/application/config/openapi.json";

/* eslint-disable class-methods-use-this */
class MetadataHandler {
    alive: RequestHandler = async (_, reply) =>
        reply.send({
            status: "ok",
        });

    docs: RequestHandler = async (_, reply) => {
        reply.code(200).send({
            docs: `${clientURL}/docs`,
            openapi: `${serverURL}/openapi/v1/schemas`,
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
