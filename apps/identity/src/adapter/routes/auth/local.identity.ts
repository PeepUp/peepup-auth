import { IdentityRoutes } from "@/types/types";
import { $ref } from "../../../adapter/schema/auth.schema";
import AuthLocalStrategyHandler from "../../handler/authentication";
import IdentityService from "../../service/identity";

/**
 * @todo
 *  ☑️ clean up this mess (code smells & clean code)
 *  ☐ add validation
 *  ☐ add error handling
 *  ☐ add logging
 *  ☐ add tests
 */
export default (identitiesService: IdentityService): { routes: IdentityRoutes } => {
    const handler = new AuthLocalStrategyHandler(identitiesService);

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
