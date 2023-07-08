import { POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA } from "../schema/token";
import TokenManagementService from "../service/token";

import type { RequestHandler } from "@/types/types";
import type { PostRefreshTokenParams } from "../schema/token";

class TokenHandler {
    constructor(private tokenManagementService: TokenManagementService) {}

    createToken: RequestHandler<
        unknown,
        unknown,
        unknown,
        unknown,
        PostRefreshTokenParams
    > = async (request, reply) => {
        const { query } = request;
        const { refresh_token: token } = query;

        console.log({ query });
        const valid = POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA.safeParse(request.query);

        if (!valid) {
            return reply.code(400).send({
                code: 400,
                message: "bad request",
            });
        }

        if (!token) {
            return reply.code(401).send({ code: 401, message: "unauthorized" });
        }

        const data = await this.tokenManagementService.generateTokenFromRefreshToken(
            query
        );

        if (!data) {
            return reply.code(401).send({ code: 401, message: "unauthorized" });
        }

        return reply.code(200).send(data);
    };
}

export default TokenHandler;
