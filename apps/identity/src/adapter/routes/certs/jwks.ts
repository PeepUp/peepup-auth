import OAuthConfigurationHandler from "../../handler/oauth2.config";

import type { IdentityRoutes } from "@/types/types";

export default (): { routes: IdentityRoutes } => {
    const handler = new OAuthConfigurationHandler();

    return {
        routes: [
            {
                method: "GET",
                url: "/oauth2/v1/jwks/:*",
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

// Define a custom route interface
/* interface CustomRequest extends FastifyRequest {
    RawQuery: null;
    Params: null;
    Headers: null;
    Body: null;
    Querystring: null;
    Url: string;
  } */
