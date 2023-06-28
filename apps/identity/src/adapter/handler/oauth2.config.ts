import { RequestHandler } from "@/types/types";
import { existsSync } from "fs";
import { join } from "path";
import { fileUtils } from "../../common";

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

    jwksCerts: RequestHandler = async (request, reply) => {
        const { wildcard: path } = request.params;
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
