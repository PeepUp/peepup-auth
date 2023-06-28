import {
    GET_IDENTITY_PARAMS_ID_SCHEMA,
    GET_IDENTITY_PARTIAL_QUERY_SCHEMA,
} from "../schema/identity";
import IdentityService from "../service/identity";

import type { RequestHandler } from "@/types/types";
import type { GetIdentityParamsId, IdentityQueryPartial } from "../schema/identity";

/**
 * @todo:
 *  ☐ check smells code
 *
 *  ☑️ clean up this mess (code smells & clean code)
 *
 */
class IdentityHandler {
    constructor(private readonly identitiesService: IdentityService) {}

    identities: RequestHandler<{ Query: IdentityQueryPartial }> = async (
        request,
        reply
    ) => {
        const { email, username } = <IdentityQueryPartial>request.query;
        const hasKeys = Object.entries(request.query).length > 0;

        if (hasKeys) {
            const parseQuery = GET_IDENTITY_PARTIAL_QUERY_SCHEMA.safeParse(request.query);

            if (!parseQuery.success) {
                reply.code(400).send({
                    code: 400,
                    message: "bad request",
                    details: `found unknown / ${JSON.stringify(
                        request.query
                    )} / in query params`,
                    data: [],
                });
            }

            const data = await this.identitiesService.getIdentityByQuery({
                email,
                username,
            });

            if (data === null || Object.entries(data).length <= 0) {
                reply.code(200).send({
                    code: 404,
                    message: "data identity record not found",
                    data: [],
                });
            }

            reply.code(200).send({
                data,
            });

            return reply;
        }

        const data = await this.identitiesService.getIdentities();

        if (data === null || data.length === 0) {
            /**
             * @todo
             *  ☐ make this as error no data found
             *
             */
            reply.code(200).send({
                code: 404,
                message: "data identity record not found",
                data,
            });
        }

        reply.code(200).send({
            data,
        });

        return reply;
    };

    getIdentityById: RequestHandler<GetIdentityParamsId> = async (request, reply) => {
        const { id } = request.params;
        const parseId = GET_IDENTITY_PARAMS_ID_SCHEMA.safeParse(request.params);

        if (!parseId.success) {
            reply.code(400).send({
                code: 400,
                message: "bad request",
            });

            return reply;
        }

        const data = await this.identitiesService.getIdentityById(id);

        if (!data) {
            reply.code(200).send({
                code: 404,
                message: "data identity record not found",
                data: [],
            });
        }

        reply.code(200).send({
            data,
        });

        return reply;
    };

    updateIdentityById: RequestHandler<GetIdentityParamsId> = async (request, reply) => {
        const { id } = request.params;
        const parseId = GET_IDENTITY_PARAMS_ID_SCHEMA.safeParse(request.params);

        if (!parseId.success) {
            reply.code(400).send({
                code: 400,
                message: "bad request",
            });

            return reply;
        }

        const data = await this.identitiesService.updateIdentityById(id, request.body);

        console.log({ data });

        if (!data) {
            reply.code(400).send({
                code: 400,
                status: "bad request",
                message: "cannot update identity record",
            });
        }

        reply.code(200).send({
            data,
        });

        return reply;
    };

    deleteIdentityById: RequestHandler<GetIdentityParamsId> = async (request, reply) => {
        const { id } = request.params;
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
