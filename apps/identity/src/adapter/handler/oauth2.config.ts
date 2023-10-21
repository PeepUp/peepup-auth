import { join } from "path";
import { existsSync } from "fs";

import * as constant from "@/common/constant";
import FileUtil from "@/common/utils/file.util";

import type { RequestHandler, unknown as _ } from "@/types/types";

class OAuthConfigurationHandler {
    private readonly jwksPath: string = join(constant.publicDirPath, constant.jwksPath);

    jwksKeys: RequestHandler = async (_request, reply) => {
        if (!existsSync(this.jwksPath)) {
            return reply.code(404).send({
                status: "not found",
            });
        }

        const jwksContent = FileUtil.readFile({ path: this.jwksPath, encoding: "utf-8" });

        if (jwksContent === null) {
            return reply.code(404).send({
                status: "not found",
            });
        }

        const json = await JSON.parse(jwksContent);
        return reply.code(200).send(json);
    };

    jwksCerts: RequestHandler<_, _, _, { "*": string }> = async (request, reply) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { "*": path } = request.params;

        if (!existsSync(this.jwksPath)) {
            return reply.code(404).send({
                status: "not found",
            });
        }

        const jwksContent = FileUtil.readFile({ path: this.jwksPath, encoding: "utf-8" });

        if (jwksContent === null) {
            return reply.code(404).send({
                status: "not found",
            });
        }

        return reply.type("application/octet-stream").send(jwksContent);
    };
}

export default OAuthConfigurationHandler;
