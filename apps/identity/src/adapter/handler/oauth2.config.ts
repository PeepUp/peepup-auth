import { join } from "path";
import { existsSync } from "fs";

import * as constant from "@/common/constant";
import FileUtil from "@/common/utils/file.util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RequestHandler, unknown as _ } from "@/types/types";

class OAuthConfigurationHandler {
    private readonly jwksCertsPath: string = join(
        constant.publicDirPath,
        constant.jwksPath
    );

    // eslint-disable-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jwksKeys: RequestHandler = async (_, reply) => {
        if (!existsSync(this.jwksCertsPath)) {
            return reply.code(200).send({ data: [] });
        }

        const jwksContent = FileUtil.readFile({
            path: this.jwksCertsPath,
            encoding: "utf-8",
        });

        if (jwksContent === null) {
            return reply.code(200).send({ data: [] });
        }

        const data = await JSON.parse(jwksContent);
        return reply.code(200).send(data);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jwksCerts: RequestHandler = async (_, reply) => {
        if (!existsSync(this.jwksCertsPath)) {
            return reply.code(200).send({ data: [] });
        }

        const data = FileUtil.readFile({
            path: this.jwksCertsPath,
            encoding: "utf-8",
        });

        if (data === null) {
            return reply.code(200).send({ data: [] });
        }

        return reply
            .type("application/octet-stream")
            .headers({
                "Content-Disposition": `attachment; filename=jwks.json`,
                "Content-Type": "application/json",
            })
            .send(data);
    };
}

export default OAuthConfigurationHandler;
