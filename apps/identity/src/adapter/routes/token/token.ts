import path from "path";
import config from "@/application/config/api.config";

import { $ref } from "@/adapter/schema";
import { Action as Act, Resource, Method } from "@/common/constant";

import TokenHandler from "@/adapter/handler/token";
import Authorization from "@/adapter/middleware/guard/authz";

import type { IdentityRoutes, Routes } from "@/types/types";
import type TokenManagementService from "@/adapter/service/tokens/token";

export default (tokenService: TokenManagementService): Routes<IdentityRoutes> => {
    const handler = new TokenHandler(tokenService);
    const { paths } = config.api.paths.tokens;

    return {
        routes: [
            {
                method: "GET",
                url: "/tokens/csrf",
                handler: handler.generateCSRFToken,
            },
            {
                method: Method.GET,
                url: "/tokens/verify",
                onRequest: Authorization.policy([{ action: Act.read, subject: Resource.token }]),
                handler: handler.verifyToken,
            },
            {
                method: Method.GET,
                url: path.join(paths.sessions.root, "/:id"),
                onRequest: Authorization.policy([{ action: Act.read, subject: Resource.token }]),
                handler: handler.getTokenById,
                schema: { request: { params: $ref("ID_TOKEN_PARAMS") } },
            },
            {
                /* !!! THIS WILL REVOKED THE CURRENT SESSION,
                 * NOT DELETED THE TOKEN SESSION IN DATABASE */
                method: Method.DELETE,
                url: path.join(paths.sessions.root, "/:id"),
                onRequest: Authorization.policy([{ action: Act.delete, subject: Resource.token }]),
                handler: handler.deleteSessionById,
                schema: { request: { params: $ref("ID_TOKEN_PARAMS") } },
            },
            {
                method: paths.sessions.method,
                url: paths.sessions.paths.active.path,
                onRequest: Authorization.policy([{ action: Act.read, subject: Resource.token }]),
                handler: handler.getActiveTokenSessions,
            },

            {
                method: paths.sessions.paths.histories.method,
                url: paths.sessions.paths.histories.path,
                onRequest: Authorization.policy([{ action: Act.read, subject: Resource.token }]),
                handler: handler.getSessionsHistories,
            },
            {
                method: paths.sessions.paths.whoami.method,
                url: paths.sessions.paths.whoami.path,
                onRequest: Authorization.policy([{ action: Act.read, subject: Resource.token }]),
                handler: handler.whoAmI,
            },
            {
                method: paths.sessions.method,
                url: paths.sessions.root,
                onRequest: Authorization.policy([{ action: Act.read, subject: Resource.token }]),
                handler: handler.getAllTokenSessions,
            },
            {
                method: paths.decode.method,
                url: paths.decode.path,
                onRequest: Authorization.policy([{ action: Act.read, subject: Resource.token }]),
                handler: handler.getDecodedToken,
                schema: { request: { querystring: $ref("TOKEN_QUERY_STRING") } },
            },
            {
                method: paths.rotate.method,
                url: paths.rotate.path,
                onRequest: Authorization.policy([{ action: Act.manage, subject: Resource.token }]),
                handler: handler.roteteToken,
                schema: {
                    request: { querystring: $ref("POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA") },
                },
            },
        ],
    };
};
