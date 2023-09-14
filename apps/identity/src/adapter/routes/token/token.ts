import type { IdentityRoutes, Routes } from "@/types/types";

import * as schema from "@/adapter/schema";
import * as constant from "@/common/constant";
import TokenHandler from "@/adapter/handler/token";
import config from "@/application/config/api.config";
import Authorization from "@/adapter/middleware/guard/authz";
import TokenManagementService from "@/adapter/service/token";

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
    const { paths } = config.api.paths.tokens;
    console.log(paths);

    return {
        routes: [
            {
                method: "GET",
                url: "/tokens/sessions/:id",
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
                url: "/tokens/sessions/:id",
                handler: handler.deleteSessionById,
            },
            {
                method: "GET",
                url: "/tokens/sessions/active",
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
                url: "/tokens/sessions/histories",
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
                url: "/tokens/sessions/whoami",
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: "Token",
                    },
                ]),

                handler: handler.getWhoAmI,
            },
            {
                method: paths.decode.method,
                url: paths.decode.path,
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
                method: paths.rotate.method,
                url: paths.rotate.path,
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
