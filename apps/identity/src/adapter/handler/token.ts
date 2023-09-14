import { ip_schema } from "@/adapter/schema/auth";
import { POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA } from "@/adapter/schema/token";
import TokenManagementService from "@/adapter/service/token";

import type { RequestHandler } from "@/types/types";
import type {
    PostRefreshTokenParams,
    TokenQueryString,
    idTokenParams,
} from "../schema/token";

class TokenHandler {
    constructor(private tokenManagementService: TokenManagementService) {}

    getTokenSessionById: RequestHandler<unknown, unknown, unknown, idTokenParams> =
        async (request, reply) => {
            const { params } = request;
            const data = await this.tokenManagementService.getTokenById(params.id);

            reply.code(200).send({
                data,
            });
        };

    deleteSessionById: RequestHandler<unknown, unknown, unknown, idTokenParams> = async (
        request,
        reply
    ) => {
        const { params } = request;
        const data = await this.tokenManagementService.revokeToken(params.id);

        if (!data) {
            return reply.code(400).send({
                code: 400,
                message: "Bad Request",
            });
        }

        return reply.code(204).send();
    };

    getWhoAmI: RequestHandler = async (request, reply) => {
        const { headers } = request;
        const token = this.tokenManagementService.splitAuthzHeader(
            headers.authorization as string
        );

        const data = await this.tokenManagementService.decodeToken(token);
        if (!data) {
            return reply.code(400).send({
                code: 400,
                message: "Bad Request",
            });
        }

        return reply.code(200).send({ data });
    };

    getDecodedToken: RequestHandler<
        unknown,
        unknown,
        unknown,
        unknown,
        TokenQueryString
    > = async (request, reply) => {
        const { query } = request;
        const data = await this.tokenManagementService.decodeToken(query.token);

        if (!data) {
            return reply.code(400).send({
                code: 400,
                message: "Bad Request",
            });
        }

        return reply.code(200).send({
            data,
        });
    };

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
        console.log(headers);

        const data = await this.tokenManagementService.getTokenSessions(
            headers.authorization as string
        );

        reply.code(200).send({
            length: data?.length,
            data,
        });
    };

    getSessionsHistories: RequestHandler = async (request, reply) => {
        const { headers } = request;

        const data = await this.tokenManagementService.getTokenHistories(
            headers.authorization as string
        );

        reply.code(200).send({
            length: data?.length,
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
