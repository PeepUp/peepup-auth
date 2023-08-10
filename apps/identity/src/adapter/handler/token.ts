import type { RequestHandler } from "@/types/types";
import { POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA } from "../schema/token";
import TokenManagementService from "../service/token";

import type { PostRefreshTokenParams } from "../schema/token";
import { ip_schema } from "../schema/auth";

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

        const ip_address =
            ip_schema.safeParse(request.ip).success === true ? request.ip : "";
        const device_id = request.headers["x-device-id"] as string;

        if (!valid) {
            return reply.code(400).send({
                code: 400,
                message: "Bad Request",
            });
        }

        const data = await this.tokenManagementService.rotateToken(
            request.query,
            ip_address,
            device_id
        );

        return reply.code(200).send(data);
    };

    getSessions: RequestHandler = async (request, reply) => {
        const { headers } = request;

        const data = await this.tokenManagementService.getWhitelistedTokens(
            headers.authorization as string
        );

        reply.code(200).send({
            data,
        });
    };

    getSessionsHistories: RequestHandler = async (request, reply) => {
        const { headers } = request;

        const data = await this.tokenManagementService.getTokenHistories(
            headers.authorization as string
        );

        reply.code(200).send({
            data,
        });
    };

    // eslint-disable-next-line class-methods-use-this
    deleteSessions: RequestHandler = async (request, reply) => {
        const { headers } = request;

        console.log(headers);

        reply.code(200).send({
            message: "success",
        });
    };
}

export default TokenHandler;
