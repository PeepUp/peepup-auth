import type { IdentityRoutes, Routes } from "@/types/types";
import type IdentityService from "@/adapter/service/identity";

import { $ref } from "../../schema";
import IdentityHandler from "../../handler/identity";

export default (identityService: IdentityService): Routes<IdentityRoutes> => {
    const identityHandler = new IdentityHandler(identityService);

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
            {
                method: "POST",
                url: "/identities/:id/inactivate",
                handler: identityHandler.inactivated,
                schema: {
                    request: {
                        body: $ref("POST_REGISTER_IDENTITY_BODY_SCHEMA"),
                    },
                },
            },
        ],
    };
};
