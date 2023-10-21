import type { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import JwtToken from "@/common/utils/token";
import * as constant from "@/common/constant";
import AbilityFactory from "@/domain/factory/ability";
import HTTPUtil from "@/common/utils/http.util";

class AbilityGuard {
    // eslint-disable-next-line class-methods-use-this
    async abac(request: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) {
        const { authorization } = request.headers;

        if (!constant.protectedResource.includes(request.routeOptions.url)) return done();

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
                checkType: true,
                authType: "Bearer",
            },
        });

        const { id, resource } = JwtToken.decodeJwt(token as string);

        if (!id || !resource) {
            return reply.code(401).send({
                ok: false,
                code: 401,
                codeStatus: "Unauthorized",
                message: "Token Authorization is missing or invalid",
            });
        }

        request.ability = new AbilityFactory().defineAbilityFor({
            id: id as string,
            role: resource as string,
        });

        return done();
    }
}

export default AbilityGuard;
