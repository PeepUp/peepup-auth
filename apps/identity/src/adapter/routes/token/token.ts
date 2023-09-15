import type { IdentityRoutes, Routes } from "@/types/types";

import { join } from "path";
import * as schema from "@/adapter/schema";
import * as constant from "@/common/constant";
import TokenHandler from "@/adapter/handler/token";
import config from "@/application/config/api.config";
import Authorization from "@/adapter/middleware/guard/authz";
import TokenManagementService from "@/adapter/service/tokens/token";

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

    return {
        routes: [
            {
                method: "GET",
                url: join(paths.sessions.root, "/:id"),
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: constant.ResourceList.token,
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
                url: join(paths.sessions.root, ":id"),
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.delete,
                        subject: constant.ResourceList.token,
                    },
                ]),
                handler: handler.deleteSessionById,
                schema: {
                    request: {
                        params: schema.$ref("ID_TOKEN_PARAMS"),
                    },
                },
            },

            {
                method: paths.sessions.method,
                url: paths.sessions.root,
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: constant.ResourceList.token,
                    },
                ]),
                handler: handler.getSessions,
            },
            {
                method: paths.sessions.paths.histories.method,
                url: paths.sessions.paths.histories.path,
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: constant.ResourceList.token,
                    },
                ]),
                handler: handler.getSessionsHistories,
            },
            {
                method: paths.sessions.paths.whoami.method,
                url: paths.sessions.paths.whoami.path,
                onRequest: Authorization.policy([
                    {
                        action: constant.Action.read,
                        subject: constant.ResourceList.token,
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
                        subject: constant.ResourceList.token,
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
                        subject: constant.ResourceList.token,
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
