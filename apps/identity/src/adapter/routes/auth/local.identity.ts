import { $ref } from "../../schema/auth.schema";
import AuthLocalStrategyHandler from "../../handler/authentication";

import type { IdentityRoutes } from "@/types/types";
import type AuthenticationService from "../../service/authentication";

/**
 * @todo
 *  ☑️ clean up this mess (code smells & clean code)
 *  ☐ add validation
 *  ☐ add error handling
 *  ☐ add logging
 *  ☐ add tests
 */
export default (
    authenticationService: AuthenticationService
): { routes: IdentityRoutes } => {
    const handler = new AuthLocalStrategyHandler(authenticationService);

    return {
        routes: [
            {
                method: "POST",
                url: "/local/registration",
                handler: handler.registration,
                schema: {
                    request: {
                        body: $ref("POST_REGISTER_IDENTITY_BODY_SCHEMA"),
                    },
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
        ],
    };
};
