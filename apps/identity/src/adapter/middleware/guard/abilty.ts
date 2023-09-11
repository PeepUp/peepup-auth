import type { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import * as constant from "../../../common/constant";
import JwtToken from "../../../common/utils/token";
import * as utils from "../../../common/utils/utils";
import AbilityFactory from "../../../domain/factory/ability";

class AbilityGuard {
    // eslint-disable-next-line class-methods-use-this
    async abac(request: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) {
        const { authorization } = request.headers;

        if (!constant.protectedResource.includes(request.routerPath)) return done();

        if (!authorization) {
            return reply.code(401).send({
                ok: false,
                code: 401,
                codeStatus: "Unauthorized",
                message: "Token Authorization header is missing or invalid",
            });
        }

        const token: string = utils.httpUtils.getAuthorizationToken({
            value: authorization as string,
            authType: "Bearer",
            checkType: true,
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
