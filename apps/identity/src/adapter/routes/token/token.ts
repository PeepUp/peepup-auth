import type { IdentityRoutes, Routes } from "@/types/types";

import { $ref } from "../../schema";
import TokenHandler from "../../handler/token";
import TokenManagementService from "../../service/token";

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
                url: "/token/sessions/:id",
                handler: handler.deleteSessionById,
            },
            {
                method: "GET",
                url: "/token/sessions/active",
                handler: handler.getSessions,
            },
            {
                method: "GET",
                url: "/token/sessions/histories",
                handler: handler.getSessionsHistories,
            },
            {
                method: "GET",
                url: "/token/sessions/whoami",
                handler: handler.getWhoAmI,
            },
            {
                method: "POST",
                url: "/token/decode",
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
