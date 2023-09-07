import type { IdentityRoutes, Routes } from "@/types/types";
import type IdentityService from "@/adapter/service/identity";

import { $ref } from "../../schema";
import IdentityHandler from "../../handler/identity";
import AuthZ from "../../../adapter/middleware/guard/authz";
import { Action } from "../../../common/constant";

export default (identityService: IdentityService): Routes<IdentityRoutes> => {
    const identityHandler = new IdentityHandler(identityService);

    return {
        routes: [
            {
                method: "GET",
                url: "/identities",
                onRequest: AuthZ.authorize([
                    {
                        action: Action.read,
                        subject: "Identity",
                    },
                ]),
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
                onRequest: AuthZ.authorize([
                    {
                        action: Action.read,
                        subject: "Identity",
                    },
                ]),
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
                onRequest: AuthZ.authorize([
                    {
                        action: Action.update,
                        subject: "Identity",
                    },
                ]),
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
                onRequest: AuthZ.authorize([
                    {
                        action: Action.delete,
                        subject: "Identity",
                    },
                ]),
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
                onRequest: AuthZ.authorize([
                    {
                        action: Action.update,
                        subject: "Identity",
                    },
                ]),
                handler: identityHandler.inactivate,
                schema: {
                    request: {
                        body: $ref("POST_REGISTER_IDENTITY_BODY_SCHEMA"),
                    },
                },
            },
        ],
    };
};
