import { z } from "zod";
import IdentityService from "../service/identity";

import type { RequestHandler } from "@/types/types";
import { RequestIdentityParams } from "../routes/identity/identity";

/**
 * @todo:
 *  ☐ clean up this mess (code smells & clean code)
 *
 */
class IdentityHandler {
    constructor(readonly identitiesService: IdentityService) {}

    identities: RequestHandler<RequestIdentityParams> = async (request, reply) => {
        const { email, username } = request.query;

        if (Object.keys(request.query).length > 0) {
            const data = await this.identitiesService.getIdentityByQuery({
                email,
                username,
            });

            if (data === null || Object.keys(data).length === 0) {
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

    getIdentityById: RequestHandler<GetIdentitiesByIdParams> = async (request, reply) => {
        const { id } = request.params;

        const data = await this.identitiesService.getIdentityById(id);

        if (data === null || Object.keys(data).length === 0) {
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
}

export default IdentityHandler;

export const getIdentitiesById = z.object({
    id: z.string().uuid(),
});

export const registerMethodValues = ["password", "oidc"] as const;
export const passwordIdentifier = ["email", "username"] as const;
export const requestRegisterIdentityBody = z.object({
    traits: z.object({
        email: z.string().email().optional(),
        username: z.string().optional(),
    }),
    method: z.enum(registerMethodValues),
    password: z.string(),
});
export const identityPasswordIdentifier = z.object({
    password_identifier: z.enum(passwordIdentifier),
});
export const requestLoginIdentityBody = requestRegisterIdentityBody.merge(
    identityPasswordIdentifier
);

export type GetIdentitiesByIdParams = z.infer<typeof getIdentitiesById>;
export type RequestLoginIdentityBody = z.infer<typeof requestLoginIdentityBody>;
export type RequestRegisterIdentityBody = z.infer<typeof requestRegisterIdentityBody>;
