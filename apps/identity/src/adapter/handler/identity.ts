import type { RequestHandler } from "@/types/types";
import {
    GET_IDENTITY_PARAMS_ID_SCHEMA,
    GET_IDENTITY_PARTIAL_QUERY_SCHEMA,
} from "../schema/identity";

import type IdentityService from "../service/identity";
import type {
    GetIdentityParamsId,
    IdentityQueryPartial,
    PutIdentityBody,
} from "../schema/identity";

/**
 * @todo:
 *  ☐ check smells code
 *
 *  ☑️ clean up this mess (code smells & clean code)
 *
 */
class IdentityHandler {
    constructor(private readonly identitiesService: IdentityService) {}

    identities: RequestHandler<unknown, unknown, unknown, unknown, IdentityQueryPartial> =
        async (request, reply) => {
            const { email, username } = request.query;
            const hasKeys = Object.values(request.query).length > 0;

            if (hasKeys) {
                const parseQuery = GET_IDENTITY_PARTIAL_QUERY_SCHEMA.safeParse(
                    request.query
                );

                if (!parseQuery.success) {
                    return reply.code(400).send({
                        code: 400,
                        message: "bad request",
                        details: `found unknown / ${JSON.stringify(
                            request.query
                        )} / in query params`,
                    });
                }

                const data = await this.identitiesService.getIdentityByQuery({
                    email,
                    username,
                });

                if (data === null || Object.entries(data).length <= 0) {
                    return reply.code(200).send({
                        code: 404,
                        message: "data identity record not found",
                        data: [],
                    });
                }

                return reply.code(200).send({
                    data,
                });
            }

            const data = await this.identitiesService.getIdentities();

            if (data === null || data.length === 0) {
                /**
                 * @todo
                 *  ☐ make this as error no data found
                 *
                 */
                return reply.code(200).send({
                    code: 404,
                    message: "data identity record not found",
                    data,
                });
            }

            return reply.code(200).send({
                data,
            });
        };

    getIdentityById: RequestHandler<unknown, unknown, unknown, GetIdentityParamsId> =
        async (request, reply) => {
            const { id } = request.params;
            const parseId = GET_IDENTITY_PARAMS_ID_SCHEMA.safeParse(request.params);

            if (!parseId.success) {
                return reply.code(400).send({
                    code: 400,
                    message: "bad request",
                });
            }

            const data = await this.identitiesService.getIdentityById(id);

            if (!data) {
                return reply.code(200).send({
                    code: 404,
                    message: "data identity record not found",
                    data: [],
                });
            }

            return reply.code(200).send({
                data,
            });
        };

    updateIdentityById: RequestHandler<
        unknown,
        unknown,
        PutIdentityBody,
        GetIdentityParamsId
    > = async (request, reply) => {
        const { id } = request.params;
        const { lastName, firstName, avatar } = request.body;
        const parseId = GET_IDENTITY_PARAMS_ID_SCHEMA.safeParse(request.params);

        if (!parseId.success) {
            return reply.code(400).send({
                code: 400,
                message: "bad request",
            });
        }

        const data = await this.identitiesService.updateIdentityById(id, {
            lastName,
            firstName,
            avatar,
        });

        if (!data) {
            return reply.code(400).send({
                code: 400,
                status: "bad request",
                message: "cannot update identity record",
            });
        }

        return reply.code(200).send({
            data,
        });
    };

    deleteIdentityById: RequestHandler<{ Params: GetIdentityParamsId }> = async (
        request,
        reply
    ) => {
        const { id } = <GetIdentityParamsId>request.params;
        const parseId = GET_IDENTITY_PARAMS_ID_SCHEMA.safeParse(request.params);

        if (!parseId.success) {
            return reply.code(400).send({
                code: 400,
                message: "bad request",
                errorss: parseId.error.message,
            });
        }

        const deleted = await this.identitiesService.deleteIdentityById(id);

        if (!deleted) {
            return reply.code(400).send({
                code: 400,
                message: "bad request",
                errorss: `cannot delete identity record with id /${id}/`,
            });
        }

        return reply.code(204).send();
    };
}

export default IdentityHandler;
