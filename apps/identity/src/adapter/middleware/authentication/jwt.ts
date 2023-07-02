/* eslint-disable consistent-return */
import { FastifyReply, FastifyRequest } from "fastify";
import type TokenManagementService from "@/adapter/service/token";
import JOSEToken from "../../../common/token.util";
import { protectedResource } from "../../../common/constant";

async function jwt(
    request: FastifyRequest,
    reply: FastifyReply,
    tokenManagementService: TokenManagementService
) {
    const { headers, routerPath } = request;
    const { authorization } = headers;

    console.log("url: ", routerPath);

    if (protectedResource.includes(routerPath)) {
        console.log("authorization bearer: ", authorization);

        if (!authorization) {
            return reply.code(401).send({
                ok: false,
                code: 401,
                codeStatus: "Unauthorized",
            });
        }

        const token = authorization.split(" ")[1];
        const decode = JOSEToken.decodeJwt(token);

        console.log({ decode });

        if (!decode) {
            return reply.code(401).send({
                ok: false,
                code: 401,
                codeStatus: "Unauthorized",
            });
        }

        const data = await tokenManagementService.verifyToken(token, {
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

        console.log("data in middleware: ", data);
    }
}

export default jwt;
