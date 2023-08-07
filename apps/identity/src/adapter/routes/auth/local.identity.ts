import type { Routes, IdentityRoutes } from "@/types/types";
import type AuthenticationService from "../../service/authentication";

import { $ref } from "../../schema";
import AuthLocalStrategyHandler from "../../handler/authentication";

/**
 * @todo
 *  ☑️ clean up this mess (code smells & clean code)
 *  ☐ add validation
 *  ☐ add error handling
 *  ☐ add logging
 *  ☐ add tests
 */
export default (authService: AuthenticationService): Routes<IdentityRoutes> => {
    const handler = new AuthLocalStrategyHandler(authService);

    return {
        routes: [
            {
                method: "POST",
                url: "/local/registration",
                handler: handler.registration,
                schema: {
                    body: $ref("POST_REGISTER_IDENTITY_BODY_SCHEMA"),
                },
            },
            {
                method: "POST",
                url: "/local/login",
                handler: handler.login,
                schema: {
                    request: {
                        body: $ref("POST_LOGIN_IDENTITY_BODY_SCHEMA"),
                    },
                },
            },

            {
                method: "DELETE",
                url: "/local/logout/api",
                handler: handler.logout,
            },
        ],
    };
};
