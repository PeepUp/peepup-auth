import type { IdentityRoutes, Routes } from "@/types/types";

import * as schema from "../../schema";
import TokenHandler from "../../handler/token";
import * as constant from "../../../common/constant";
import Authorization from "../../middleware/guard/authz";
import TokenManagementService from "../../service/token";

/**
 * @todo
 *  ☑️ clean up this mess (code smells & clean code)
 *  ☑️ add validation
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
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: "Token",
                    },
                ]),
                handler: handler.getTokenSessionById,
                schema: {
                    request: {
                        params: schema.$ref("ID_TOKEN_PARAMS"),
                    },
                },
            },
            {
                /* IT'LL REVOKED THE CURRENT SESSION,
                 * NOT DELETED THE TOKEN SESSION */
                method: "DELETE",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.delete,
                        subject: "Token",
                    },
                ]),
                url: "/token/sessions/:id",
                handler: handler.deleteSessionById,
            },
            {
                method: "GET",
                url: "/token/sessions/active",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: "Token",
                    },
                ]),
                handler: handler.getSessions,
            },
            {
                method: "GET",
                url: "/token/sessions/histories",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: "Token",
                    },
                ]),
                handler: handler.getSessionsHistories,
            },
            {
                method: "GET",
                url: "/token/sessions/whoami",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: "Token",
                    },
                ]),

                handler: handler.getWhoAmI,
            },
            {
                method: "POST",
                url: "/token/decode",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: "Token",
                    },
                ]),
                handler: handler.getDecodedToken,
                schema: {
                    request: {
                        querystring: schema.$ref("TOKEN_QUERY_STRING"),
                    },
                },
            },

            {
                method: "POST",
                url: "/token",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.manage,
                        subject: "Token",
                    },
                ]),
                handler: handler.roteteToken,
                schema: {
                    request: {
                        querystring: schema.$ref(
                            "POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA"
                        ),
                    },
                },
            },
        ],
    };
};
