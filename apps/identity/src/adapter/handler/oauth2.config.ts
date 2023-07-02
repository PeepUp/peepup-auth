import { existsSync } from "fs";
import { join } from "path";
import type { RequestHandler } from "@/types/types";
import { fileUtils } from "../../common";


/* eslint-disable class-methods-use-this */
class OAuthConfigurationHandler {
    jwksKeys: RequestHandler = async (_, reply) => {
        const jwksPath = join(process.cwd(), "public/.well-known/jwks.json");

        if (!existsSync(jwksPath)) {
            return reply.code(404).send({
                status: "not found",
            });
        }

        const jwksContent = fileUtils.readFile(jwksPath, "utf-8");
        if (jwksContent === null) {
            return reply.code(404).send({
                status: "not found",
            });
        }

        const json = await JSON.parse(jwksContent);

        return reply.code(200).send(json);
    };

    jwksCerts: RequestHandler<unknown, unknown, unknown, { "*": string }> = async (
        request,
        reply
    ) => {
        const { "*": path } = request.params;
        const jwksPath = join(process.cwd(), "public/.well-known", path);

        console.log(jwksPath, path);

        if (!existsSync(jwksPath)) {
            return reply.code(404).send({
                status: "not found",
            });
        }

        const jwksContent = fileUtils.readFile(jwksPath, "utf-8");

        if (jwksContent === null) {
            return reply.code(404).send({
                status: "not found",
            });
        }

        return reply.type("application/octet-stream").send(jwksContent);
    };
}

export default OAuthConfigurationHandler;
