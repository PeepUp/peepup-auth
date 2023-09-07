import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { protectedResource } from "../../../common/constant";
import JwtToken from "../../../common/utils/token";
import { httpUtils } from "../../../common/utils/utils";
import { AbilityFactory } from "../../../domain/factory/ability";

export class AbilityGuard {
    // eslint-disable-next-line class-methods-use-this
    async abac(request: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) {
        const { headers, routerPath } = request;
        const { authorization } = headers;

        if (!protectedResource.includes(routerPath)) {
            return done();
        }

        if (!authorization) {
            return reply.code(401).send({
                ok: false,
                code: 401,
                codeStatus: "Unauthorized",
                message: "Token Authorization header is missing or invalid",
            });
        }

        const token: string = httpUtils.getAuthorizationToken({
            value: authorization as string,
            authType: "Bearer",
            checkType: true,
        });

        const decode = JwtToken.decodeJwt(token as string);

        if (!decode) {
            return reply.code(401).send({
                ok: false,
                code: 401,
                codeStatus: "Unauthorized",
                message: "Token Authorization is missing or invalid",
            });
        }

        const ability = new AbilityFactory().defineAbilityFor({
            id: decode.id as string,
            role: decode.resource as string,
        });

        request.ability = ability;

        return done();
    }
}
