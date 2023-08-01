/* eslint-disable consistent-return */
import { FastifyReply, FastifyRequest } from "fastify";
import JwtToken from "../../../common/utils/token";
import { protectedResource } from "../../../common/constant";

import type TokenManagementService from "../../service/token";

class AuthenticationMiddleware {
    static async jwt(
        request: FastifyRequest,
        reply: FastifyReply,
        tokenManagementService: TokenManagementService
    ) {
        const { headers, routerPath } = request;
        const { authorization } = headers;

        if (protectedResource.includes(routerPath)) {
            if (!authorization) {
                return reply.code(401).send({
                    ok: false,
                    code: 401,
                    codeStatus: "Unauthorized",
                    message: "Token Authorization header is missing or invalid",
                });
            }

            const token: string[] = authorization.split(" ");

            if (token[0] !== "Bearer" && token[1] === undefined) {
                return reply.code(401).send({
                    ok: false,
                    code: 401,
                    codeStatus: "Unauthorized",
                    message: "Token Authorization is missing or invalid",
                });
            }

            const decode = JwtToken.decodeJwt(token[1] as string);

            if (!decode) {
                return reply.code(401).send({
                    ok: false,
                    code: 401,
                    codeStatus: "Unauthorized",
                    message: "Token Authorization is missing or invalid",
                });
            }

            const data = await tokenManagementService.verifyToken(<string>token[1], {
                tokenId_identityId: {
                    tokenId: <string>decode.jti,
                    identityId: <string>decode.id,
                },
            });

            if (!data) {
                return reply.code(401).send({
                    ok: false,
                    code: 401,
                    codeStatus: "Unauthorized",
                });
            }
        }
    }
}

export default AuthenticationMiddleware;
