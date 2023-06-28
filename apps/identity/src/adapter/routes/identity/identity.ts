import { z } from "zod";
import IdentityHandler from "../../../adapter/handler/identity";
import { $ref } from "../../../adapter/schema/auth.schema";
import IdentityService from "../../service/identity";

import type { IdentityRoutes } from "@/types/types";

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
                schema: {
                    querystring: $ref("GET_IDENTITY_PARTIAL_QUERY_SCHEMA"),
                    response: {},
                },
            },
            {
                method: "GET",
                url: "/identities/:id",
                handler: identityHandler.getIdentityById,
                schema: {},
            },
            {
                method: "PUT",
                url: "/identities/:id",
                handler: identityHandler.updateIdentityById,
                schema: {
                    request: {
                        params: $ref("GET_IDENTITY_PARAMS_ID_SCHEMA"),
                    },
                    body: $ref("PUT_IDENTITY_BODY_SCHEMA"),
                },
            },
            {
                method: "DELETE",
                url: "/identities/:id",
                handler: identityHandler.deleteIdentityById,
                schema: {
                    request: {
                        params: $ref("GET_IDENTITY_PARAMS_ID_SCHEMA"),
                    },
                },
            },
        ],
    };
};
