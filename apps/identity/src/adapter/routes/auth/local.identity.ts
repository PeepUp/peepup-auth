import type { Routes, IdentityRoutes } from "@/types/types";
import type AuthenticationService from "@/adapter/service/authentication";

import * as schema from "@/adapter/schema";
import AuthLocalStrategyHandler from "@/adapter/handler/authentication";
import CSRFGuard from "@/adapter/middleware/guard/csrf";

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
                url: "/local/verify/email",
                handler: handler.emailAddressChecker,
                schema: {
                    body: {
                        type: "object",
                        properties: {
                            email: { type: "string" },
                        },
                        required: ["email"],
                    },
                },
            },
            {
                method: "POST",
                url: "/local/registration",
                handler: handler.registration,
                schema: {
                    body: schema.$ref("POST_REGISTER_IDENTITY_BODY_SCHEMA"),
                },
            },
            {
                method: "POST",
                url: "/local/login",
                handler: handler.login,
                onRequest: CSRFGuard.verify,
                schema: {
                    request: {
                        body: schema.$ref("POST_LOGIN_IDENTITY_BODY_SCHEMA"),
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
