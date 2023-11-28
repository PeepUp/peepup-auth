import { ip_schema } from "@/adapter/schema/auth";
import { POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA } from "@/adapter/schema/token";
import TokenManagementService from "@/adapter/service/tokens/token";

import type { RequestHandler, unknown as _ } from "@/types/types";
import type * as Schema from "@/adapter/schema/token";
import CSRF from "@/common/libs/csrf";

class TokenHandler {
    constructor(private tokenService: TokenManagementService) {}

    // eslint-disable-next-line class-methods-use-this
    generateCSRFToken: RequestHandler = async (_request, reply) => {
        const csrf = CSRF.generate();
        return reply
            .code(200)
            .cookie("__host_csrf_token", csrf, {
                domain: "127.0.0.1",
                expires: new Date(Date.now() + 86400000),
                maxAge: Date.now() + 86400000,
                secure: true,
                signed: true,
                httpOnly: true,
                sameSite: "None",
                path: "/",
            })
            .send({
                data: csrf,
            });
    };

    // eslint-disable-next-line class-methods-use-this
    verifyToken: RequestHandler<_, _, _, Schema.TokenQueryString> = async (request, reply) =>
        reply.code(200).send();

    getTokenById: RequestHandler<_, _, _, Schema.idTokenParams> = async (request, reply) => {
        const { params } = request;
        const data = await this.tokenService.getTokenById(params.id);

        return reply.code(200).send({
            data,
        });
    };

    whoAmI: RequestHandler = async (request, reply) => {
        const { headers } = request;
        const token = this.tokenService.splitAuthzHeader(headers.authorization as string);

        const data = await this.tokenService.decodeToken(token);
        if (!data) {
            return reply.code(400).send({
                code: 400,
                message: "Bad Request",
            });
        }

        return reply.code(200).send({ data });
    };

    getDecodedToken: RequestHandler<_, _, _, _, Schema.TokenQueryString> = async (
        request,
        reply
    ) => {
        const { query } = request;
        const data = await this.tokenService.decodeToken(query.token);

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

    roteteToken: RequestHandler<_, _, _, _, Schema.PostRefreshTokenParams> = async (
        request,
        reply
    ) => {
        const valid = POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA.safeParse(request.query);
        const ip_address = ip_schema.safeParse(request.ip).success === true ? request.ip : "";
        const device_id = request.headers["x-device-id"] as string;

        if (!valid) {
            return reply.code(400).send({
                code: 400,
                message: "Bad Request",
            });
        }

        const data = await this.tokenService.rotateToken(request.query, ip_address, device_id);

        return reply.code(200).send(data);
    };

    getActiveTokenSessions: RequestHandler = async (request, reply) => {
        const { headers } = request;
        const data = await this.tokenService.getActiveTokenSessions(
            headers.authorization as string
        );

        return reply.code(200).send({
            length: data?.length,
            data,
        });
    };

    getSessionsHistories: RequestHandler = async (request, reply) => {
        const { headers } = request;

        const data = await this.tokenService.getTokenHistories(headers.authorization as string);

        return reply.code(200).send({
            length: data?.length,
            data,
        });
    };

    getAllTokenSessions: RequestHandler = async (request, reply) => {
        const { headers } = request;

        const data = await this.tokenService.getAllTokenSessions(headers.authorization as string);

        return reply.code(200).send({
            length: data?.length,
            data,
        });
    };

    // eslint-disable-next-line class-methods-use-this
    deleteSessions: RequestHandler = async (_request, reply) =>
        reply.code(200).send({
            message: "success",
        });

    deleteSessionById: RequestHandler<_, _, _, Schema.idTokenParams> = async (request, reply) => {
        const { params } = request;
        const data = await this.tokenService.revokeToken(params.id);

        if (!data) {
            return reply.code(400).send({
                code: 400,
                message: "Bad Request",
            });
        }

        return reply.code(204).send();
    };
}

export default TokenHandler;
