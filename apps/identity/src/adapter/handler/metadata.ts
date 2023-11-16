import * as constant from "@/common/constant";

import type { RequestHandler } from "@/types/types";
import { join } from "path";
import FileUtil from "@/common/utils/file.util";
import BadRequestException from "../middleware/errors/bad-request-exception";

/* eslint-disable class-methods-use-this */
class MetadataHandler {
    alive: RequestHandler = async (_, reply) =>
        reply.send({
            status: "ok",
        });

    docs: RequestHandler = async (_, reply) => {
        reply.code(200).send({
            docs: `${constant.clientURL}/docs`,
            openapi: `${constant.serverURL}/openapi/schemas/open-api-v1.0`,
            certs: `${constant.serverURL}/oauth2/v1/jwks/keys`,
            "download OpenApi": `${constant.serverURL}/openapi/schemas/docs/open-api-v1.0`,
            "download certs": `${constant.serverURL}/oauth2/v1/jwks/certs`,
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

    downloadOpenApi: RequestHandler = async (request, reply) => {
        const { fn } = request.params as { fn: string };

        if (!fn || fn === ":fn") {
            throw new BadRequestException("Invalid Path Parameter");
        }

        const path = fn
            ? join(process.cwd(), "src/application/config", `${fn}.json`)
            : join(process.cwd(), "src/application/config", "open-api-v1.0.json");

        const data = FileUtil.readFile({
            path,
            encoding: "utf-8",
        });

        if (data === null) {
            return reply.code(200).send({ data: [] });
        }

        return reply
            .type("application/octet-stream")
            .headers({
                "Content-Disposition": `attachment; filename=${fn}.json`,
                "Content-Type": "application/json",
            })
            .send(data);
    };

    openapi: RequestHandler = async (request, reply) => {
        const { fn } = request.params as { fn: string };

        if (!fn || fn === ":fn") {
            throw new BadRequestException("Invalid Path Parameter");
        }

        const path = fn
            ? join(process.cwd(), "src/application/config", `${fn}.json`)
            : join(process.cwd(), "src/application/config", "open-api-v1.0.json");

        const openapi_v1 = await import(path);

        reply.code(200).send(openapi_v1.default);
    };
}

export default MetadataHandler;
