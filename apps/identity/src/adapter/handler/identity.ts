import type * as Schema from "@/adapter/schema/identity";

import type { RequestHandler, unknown as _ } from "@/types/types";
import type IdentityService from "@/adapter/service/identity";
import type { InactivatedIdentityBody } from "@/adapter/schema/auth";

import * as schema from "@/adapter/schema/identity";
import * as schemaAuth from "@/adapter/schema/auth";

import { selectQueryOption } from "../schema/db";
import BadCredentialsException from "../middleware/errors/bad-credential-exception";

class IdentityHandler {
    constructor(private readonly identitiesService: IdentityService) {}

    identities: RequestHandler<_, _, _, _, Schema.GetIdentitiesQuery> = async (request, reply) => {
        const hasKeys = Object.values(request.query).length > 0;

        if (hasKeys) {
            const parseQuery = await schema.GET_IDENTITIES_QUERY_SCHEMA.parseAsync(request.query);

            const parsedSelectOptions = await JSON.parse(request.query.select ?? "{}");
            const parsedDBOptions = await selectQueryOption.parseAsync(parsedSelectOptions);

            if (!parseQuery || !parsedDBOptions) {
                return reply.code(400).send({
                    code: 400,
                    message: "bad request",
                    details: `found _ / ${JSON.stringify(request.query)} / in query params`,
                });
            }

            const data = await this.identitiesService.getIdentityByQuery({
                ...parseQuery,
                take:
                    typeof parseQuery.take === "string"
                        ? parseInt(parseQuery.take, 10)
                        : parseQuery.take,
                select: parsedDBOptions,
            });

            if (data === null || Object.entries(data).length <= 0) {
                return reply.code(200).send({
                    code: 200,
                    ok: true,
                    message: "data identity record not found",
                    data: [],
                });
            }

            return reply.code(200).send({
                ok: true,
                data,
                length: data.length,
            });
        }

        const data = await this.identitiesService.getIdentities();

        if (data === null || data.length === 0) {
            return reply.code(200).send({
                code: 200,
                ok: true,
                message: "data identity record not found",
                data,
            });
        }

        return reply.code(200).send({
            data,
        });
    };

    getMe: RequestHandler<_, _, _, _> = async (request, reply) => {
        const { headers } = request;
        const { authorization } = headers;

        if (!authorization) {
            return reply.code(401).send({
                code: 401,
                message: "unauthorized",
            });
        }

        const data = await this.identitiesService.getMe(authorization);

        if (!data) {
            throw new BadCredentialsException();
        }

        return reply.code(200).send({
            data,
        });
    };

    getIdentityById: RequestHandler<_, _, _, Schema.GetIdentityParamsId> = async (
        request,
        reply
    ) => {
        const { id } = request.params;
        const parseId = schema.GET_IDENTITY_PARAMS_ID_SCHEMA.safeParse(request.params);

        if (!parseId.success) {
            if (parseId.error) {
                return reply.code(400).send({
                    code: 400,
                    message: "bad request",
                    details: parseId.error.issues.map((issue) => `${issue.message} \n`),
                });
            }

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

    getIdentityPreviewById: RequestHandler<_, _, _, Schema.GetIdentityParamsId> = async (
        request,
        reply
    ) => {
        console.log("get identity preview by id");
        const { id } = request.params;
        const parseId = schema.GET_IDENTITY_PARAMS_ID_SCHEMA.safeParse(request.params);

        if (!parseId.success) {
            if (parseId.error) {
                return reply.code(400).send({
                    code: 400,
                    message: "bad request",
                    details: parseId.error.issues.map((issue) => `${issue.message} \n`),
                });
            }

            return reply.code(400).send({
                code: 400,
                message: "bad request",
            });
        }

        const data = await this.identitiesService.getIdentityPreview(id);

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

    updateIdentityById: RequestHandler<_, _, Schema.PutIdentityBody, Schema.GetIdentityParamsId> =
        async (request, reply) => {
            const { id } = request.params;
            const { lastName, firstName, avatar } = request.body;
            const parseId = schema.GET_IDENTITY_PARAMS_ID_SCHEMA.safeParse(request.params);

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

    deleteIdentityById: RequestHandler<_, _, _, Schema.GetIdentityParamsId> = async (
        request,
        reply
    ) => {
        const { id } = request.params;
        const parsedId = schema.GET_IDENTITY_PARAMS_ID_SCHEMA.safeParse(request.params);

        if (!parsedId.success) {
            return reply.code(400).send({
                code: 400,
                message: "bad request",
                errors: parsedId.error.message,
            });
        }

        const deleted = await this.identitiesService.deleteIdentityById(id);

        if (!deleted) {
            return reply.code(400).send({
                code: 400,
                message: "bad request",
                errors: `cannot delete identity record with id /${id}/`,
            });
        }

        return reply.code(204).send();
    };

    deactivate: RequestHandler<_, _, InactivatedIdentityBody> = async (request, reply) => {
        const parsedBody = schemaAuth.POST_REGISTER_IDENTITY_BODY_SCHEMA.safeParse(request.body);

        if (!parsedBody.success) {
            return reply.code(400).send({
                code: 400,
                message: "bad request",
                error: await JSON.parse(parsedBody.error.message),
            });
        }

        await this.identitiesService.deactivateState(request.body);
        return reply.code(200);
    };
}

export default IdentityHandler;
