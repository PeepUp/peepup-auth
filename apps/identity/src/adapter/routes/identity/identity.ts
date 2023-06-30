import IdentityHandler from "../../../adapter/handler/identity";
import { $ref } from "../../../adapter/schema/auth.schema";

import type { IdentityRoutes } from "@/types/types";
import type IdentityService from "../../service/identity";

export default (identitiesService: IdentityService): { routes: IdentityRoutes } => {
    const identityHandler = new IdentityHandler(identitiesService);

    return {
        routes: [
            {
                method: "GET",
                url: "/identities",
                handler: identityHandler.identities,
                schema: {
                    request: {
                        querystring: $ref("GET_IDENTITY_PARTIAL_QUERY_SCHEMA"),
                    },
                },
            },
            {
                method: "GET",
                url: "/identities/:id",
                handler: identityHandler.getIdentityById,
                schema: {
                    request: {
                        params: $ref("GET_IDENTITY_PARAMS_ID_SCHEMA"),
                    },
                },
            },
            {
                method: "PUT",
                url: "/identities/:id",
                handler: identityHandler.updateIdentityById,
                schema: {
                    request: {
                        params: $ref("GET_IDENTITY_PARAMS_ID_SCHEMA"),
                        body: $ref("PUT_IDENTITY_BODY_SCHEMA"),
                    },
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
