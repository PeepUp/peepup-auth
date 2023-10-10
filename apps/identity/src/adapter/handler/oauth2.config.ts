/* eslint-disable class-methods-use-this */

import { existsSync } from "fs";
import { join } from "path";
import { fileUtils } from "@/common/utils/utils";

import type { RequestHandler, unknown as _ } from "@/types/types";
import * as constant from "@/common/constant";

class OAuthConfigurationHandler {
    jwksKeys: RequestHandler = async (_, reply) => {
        const jwksPath = join(constant.publicDirPath, constant.jwksPath);

        if (!existsSync(jwksPath))
            return reply.code(404).send({
                status: "not found",
            });

        const jwksContent = fileUtils.readFile(jwksPath, "utf-8");

        if (jwksContent === null) {
            return reply.code(404).send({
                status: "not found",
            });
        }

        const json = await JSON.parse(jwksContent);

        return reply.code(200).send(json);
    };

    jwksCerts: RequestHandler<_, _, _, { "*": string }> = async (request, reply) => {
        const { "*": path } = request.params;
        const jwksPath = join(process.cwd(), "public/.well-known", path);

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
