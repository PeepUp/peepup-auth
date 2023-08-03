import type { RequestHandler } from "@/types/types";
import { POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA } from "../schema/token";
import TokenManagementService from "../service/token";

import type { PostRefreshTokenParams } from "../schema/token";

class TokenHandler {
    constructor(private tokenManagementService: TokenManagementService) {}

    roteteToken: RequestHandler<
        unknown,
        unknown,
        unknown,
        unknown,
        PostRefreshTokenParams
    > = async (request, reply) => {
        const valid = POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA.safeParse(request.query);

        if (!valid) {
            return reply.code(400).send({
                code: 400,
                message: "Bad Request",
            });
        }

        const data = await this.tokenManagementService.rotateToken(request.query);

        if (!data) return reply.code(401).send({ code: 401, message: "unauthorized" });

        return reply.code(200).send(data);
    };

    // eslint-disable-next-line class-methods-use-this
    getHistories: RequestHandler = async (_, reply) =>
        reply.code(200).send({
            data: [
                {
                    id: "1",
                    valid: true,
                    jti: "1",
                    user_id: "1",
                    value: "random string",
                    token_type: "access_token",
                    created_at: "2021-08-01T00:00:00.000Z",
                    expires_at: "2021-08-01T00:00:00.000Z",
                },
            ],
        });
}

export default TokenHandler;
