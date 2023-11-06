/* eslint-disable consistent-return */
import type { FastifyReply, FastifyRequest } from "fastify";

import JwtToken from "@/common/lib/token";
import { protectedResource } from "@/common/constant";
import type TokenManagementService from "@/adapter/service/tokens/token";
import HTTPUtil from "@/common/utils/http.util";

class AuthenticationMiddleware {
    static async jwt(
        request: FastifyRequest,
        reply: FastifyReply,
        tokenManagementService: TokenManagementService
    ) {
        const { headers, routeOptions } = request;
        const { authorization } = headers;

        if (protectedResource.includes(routeOptions.url)) {
            if (!authorization) {
                return reply.code(401).send({
                    ok: false,
                    code: 401,
                    codeStatus: "Unauthorized",
                    message: "Token Authorization header is missing or invalid",
                });
            }

            const token: string = HTTPUtil.getAuthorization({
                value: authorization,
                options: {
                    authType: "Bearer",
                    checkType: true,
                },
            });

            if (!token) {
                return reply.code(401).send({
                    ok: false,
                    code: 401,
                    codeStatus: "Unauthorized",
                    message: "Token Authorization header is missing or invalid",
                });
            }

            const decode = JwtToken.decodeJwt(token as string);

            if (!decode) {
                return reply.code(401).send({
                    ok: false,
                    code: 401,
                    codeStatus: "Unauthorized",
                    message: "Token Authorization is missing or invalid",
                });
            }

            const data = await tokenManagementService.verifyToken(token, {
                tokenId_identityId: {
                    tokenId: decode.jti as string,
                    identityId: decode.id as string,
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
