import type { IdentityRoutes, Routes } from "@/types/types";
import type IdentityService from "@/adapter/service/identity";

import * as schema from "../../schema";
import * as constant from "../../../common/constant";
import IdentityHandler from "../../handler/identity";
import Authorization from "../../middleware/guard/authz";

export default (identityService: IdentityService): Routes<IdentityRoutes> => {
    const identityHandler = new IdentityHandler(identityService);

    return {
        routes: [
            {
                method: "GET",
                url: "/identities",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.readAll,
                        subject: "Identity",
                    },
                ]),
                handler: identityHandler.identities,
                schema: {
                    request: {
                        querystring: schema.$ref("GET_IDENTITY_PARTIAL_QUERY_SCHEMA"),
                    },
                },
            },
            {
                method: "GET",
                url: "/identities/:id",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: "Identity",
                    },
                ]),
                handler: identityHandler.getIdentityById,
                schema: {
                    request: {
                        params: schema.$ref("GET_IDENTITY_PARAMS_ID_SCHEMA"),
                    },
                },
            },
            {
                method: "PUT",
                url: "/identities/:id",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.update,
                        subject: "Identity",
                    },
                ]),
                handler: identityHandler.updateIdentityById,
                schema: {
                    request: {
                        params: schema.$ref("GET_IDENTITY_PARAMS_ID_SCHEMA"),
                        body: schema.$ref("PUT_IDENTITY_BODY_SCHEMA"),
                    },
                },
            },
            {
                method: "DELETE",
                url: "/identities/:id",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.delete,
                        subject: "Identity",
                    },
                ]),
                handler: identityHandler.deleteIdentityById,
                schema: {
                    request: {
                        params: schema.$ref("GET_IDENTITY_PARAMS_ID_SCHEMA"),
                    },
                },
            },
            {
                method: "POST",
                url: "/identities/:id/inactivate",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.update,
                        subject: "Identity",
                    },
                ]),
                handler: identityHandler.inactivate,
                schema: {
                    request: {
                        body: schema.$ref("POST_REGISTER_IDENTITY_BODY_SCHEMA"),
                    },
                },
            },
        ],
    };
};
