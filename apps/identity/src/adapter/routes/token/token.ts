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
                url: "/token/sessions",
                handler: handler.getSessions,
            },
            {
                method: "GET",
                url: "/token/sessions/histories",
                handler: handler.getSessionsHistories,
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
