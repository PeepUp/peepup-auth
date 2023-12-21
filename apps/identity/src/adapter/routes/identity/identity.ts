import { $ref } from "@/adapter/schema";
import { Action as Act, Resource, Method } from "@/common/constant";

import IdentityHandler from "@/adapter/handler/identity";
import Authorization from "@/adapter/middleware/guard/authz";

import type { IdentityRoutes, Routes } from "@/types/types";
import type IdentityService from "@/adapter/service/identity";

export default (service: IdentityService): Routes<IdentityRoutes> => {
    const handler = new IdentityHandler(service);

    return {
        routes: [
            {
                method: Method.GET,
                url: "/identities",
                onRequest: Authorization.policy([
                    { action: Act.readAll, subject: Resource.identity },
                ]),
                handler: handler.identities,
                schema: { request: { querystring: $ref("GET_IDENTITIES_QUERY_SCHEMA") } },
            },
            {
                method: Method.GET,
                url: "/identities/me",
                onRequest: Authorization.policy([{ action: Act.read, subject: Resource.identity }]),
                handler: handler.getMe,
            },
            {
                method: Method.GET,
                url: "/identities/:id",
                onRequest: Authorization.policy([{ action: Act.read, subject: Resource.identity }]),
                handler: handler.getIdentityById,
                schema: { request: { params: $ref("GET_IDENTITY_PARAMS_ID_SCHEMA") } },
            },
            {
                method: Method.PUT,
                url: "/identities/:id",
                onRequest: Authorization.policy([
                    { action: Act.update, subject: Resource.identity },
                ]),
                handler: handler.updateIdentityById,
                schema: {
                    request: {
                        params: $ref("GET_IDENTITY_PARAMS_ID_SCHEMA"),
                        body: $ref("PUT_IDENTITY_BODY_SCHEMA"),
                    },
                },
            },
            {
                method: Method.DELETE,
                url: "/identities/:id",
                onRequest: Authorization.policy([
                    { action: Act.delete, subject: Resource.identity },
                ]),
                handler: handler.deleteIdentityById,
                schema: { request: { params: $ref("GET_IDENTITY_PARAMS_ID_SCHEMA") } },
            },
            {
                method: Method.POST,
                url: "/identities/:id/deactivate",
                onRequest: Authorization.policy([
                    { action: Act.update, subject: Resource.identity },
                ]),
                handler: handler.deactivate,
                schema: { request: { body: $ref("POST_REGISTER_IDENTITY_BODY_SCHEMA") } },
            },
            {
                method: Method.GET,
                url: "/identities/:id/preview",
                handler: handler.getIdentityPreviewById,
                schema: { request: { params: $ref("GET_IDENTITY_PARAMS_ID_SCHEMA") } },
            },
        ],
    };
};
