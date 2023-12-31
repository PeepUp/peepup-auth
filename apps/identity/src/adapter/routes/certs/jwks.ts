import type { IdentityRoutes, Routes } from "@/types/types";
import OAuthConfigurationHandler from "@/adapter/handler/oauth2.config";

export default (): Routes<IdentityRoutes> => {
    const handler = new OAuthConfigurationHandler();

    return {
        routes: [
            {
                method: "GET",
                url: "/oauth2/v1/jwks/certs",
                handler: handler.jwksCerts,
                schema: {
                    request: {
                        params: {
                            "*": { type: "string" },
                        },
                    },
                },
            },
            {
                method: "GET",
                url: "/oauth2/v1/jwks/keys",
                handler: handler.jwksKeys,
            },
        ],
    };
};
