import { z } from "zod";
import IdentityHandler from "../../../adapter/handler/identity";
import IdentityService from "../../service/identity";

import type { IdentityRoutes } from "@/types/types";
import type { FastifyReply, FastifyRequest } from "fastify";

export const requestIdentityParams = z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
});

export type RequestIdentityParams = z.infer<typeof requestIdentityParams>;

export default (identitiesService: IdentityService): { routes: IdentityRoutes } => {
    const identityHandler = new IdentityHandler(identitiesService);

    return {
        routes: [
            {
                method: "GET",
                url: "/identities",
                handler: identityHandler.identities,
                schema: {},
            },
            {
                method: "GET",
                url: "/identities/:id",
                handler: async (
                    request: FastifyRequest<{ Params: { id: string } }>,
                    reply: FastifyReply
                ): Promise<unknown> => {
                    const { id } = request.params;
                    const data = await identitiesService.getIdentityById(id);

                    if (data === null) {
                        setImmediate(() => {
                            reply.code(200).send({
                                code: 404,
                                message: "data identity record not found",
                                data: [],
                            });
                        });

                        return reply;
                    }

                    setImmediate(() => {
                        reply.code(200).send({
                            data,
                        });
                    });

                    return reply;
                },
                schema: {},
            },
        ],
    };
};
