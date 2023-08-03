import type { IdentityRoutes } from "@/types/types";
import TokenHandler from "../../handler/token";
import TokenManagementService from "../../service/token";
import { $ref } from "../../schema";

/**
 * @todo
 *  ☑️ clean up this mess (code smells & clean code)
 *  ☐ add validation
 *  ☐ add error handling
 *  ☐ add logging
 *  ☐ add tests
 */
export default (
    tokenManagementService: TokenManagementService
): { routes: IdentityRoutes } => {
    const handler = new TokenHandler(tokenManagementService);

    return {
        routes: [
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
            {
                method: "GET",
                url: "/token/histories",
                handler: handler.getHistories,
            },
        ],
    };
};
