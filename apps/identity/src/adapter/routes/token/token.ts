import type { IdentityRoutes, Routes } from "@/types/types";

import { $ref } from "../../schema";
import TokenHandler from "../../handler/token";
import TokenManagementService from "../../service/token";
import AuthZ from "../../middleware/guard/authz";
import { Action } from "../../../common/constant";

/**
 * @todo
 *  ☑️ clean up this mess (code smells & clean code)
 *  ☐ add validation
 *  ☐ add error handling
 *  ☐ add logging
 *  ☐ add tests
 */
export default (tokenService: TokenManagementService): Routes<IdentityRoutes> => {
    const handler = new TokenHandler(tokenService);

    return {
        routes: [
            {
                method: "GET",
                url: "/token/sessions/:id",
                onRequest: AuthZ.authorize([
                    {
                        action: Action.read,
                        subject: "Token",
                    },
                ]),
                handler: handler.getTokenSessionById,
                schema: {
                    request: {
                        params: $ref("ID_TOKEN_PARAMS"),
                    },
                },
            },
            {
                /* IT'LL REVOKED THE CURRENT SESSION,
                 * NOT DELETED THE TOKEN SESSION */
                method: "DELETE",
                onRequest: AuthZ.authorize([
                    {
                        action: Action.delete,
                        subject: "Token",
                    },
                ]),
                url: "/token/sessions/:id",
                handler: handler.deleteSessionById,
            },
            {
                method: "GET",
                url: "/token/sessions/active",
                onRequest: AuthZ.authorize([
                    {
                        action: Action.read,
                        subject: "Token",
                    },
                ]),
                handler: handler.getSessions,
            },
            {
                method: "GET",
                url: "/token/sessions/histories",
                onRequest: AuthZ.authorize([
                    {
                        action: Action.read,
                        subject: "Token",
                    },
                ]),
                handler: handler.getSessionsHistories,
            },
            {
                method: "GET",
                url: "/token/sessions/whoami",
                onRequest: AuthZ.authorize([
                    {
                        action: Action.read,
                        subject: "Token",
                    },
                ]),

                handler: handler.getWhoAmI,
            },
            {
                method: "POST",
                url: "/token/decode",
                onRequest: AuthZ.authorize([
                    {
                        action: Action.read,
                        subject: "Token",
                    },
                ]),
                handler: handler.getDecodedToken,
                schema: {
                    request: {
                        querystring: $ref("TOKEN_QUERY_STRING"),
                    },
                },
            },

            {
                method: "POST",
                url: "/token",
                onRequest: AuthZ.authorize([
                    {
                        action: Action.manage,
                        subject: "Token",
                    },
                ]),
                handler: handler.roteteToken,
                schema: {
                    request: {
                        querystring: $ref("POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA"),
                    },
                },
            },
        ],
    };
};
