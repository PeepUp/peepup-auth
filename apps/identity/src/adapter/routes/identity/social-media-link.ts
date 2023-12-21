import { SocialMediaLinkHandler } from "@/adapter/handler/social-media-link";
import Authorization from "@/adapter/middleware/guard/authz";

import { Action as Act, Resource, Method } from "@/common/constant";

import type { IdentityRoutes, Routes } from "@/types/types";

export default (): Routes<IdentityRoutes> => {
    const h = new SocialMediaLinkHandler();

    return {
        routes: [
            {
                method: Method.GET,
                url: "/identities/:id/social-media",
                onRequest: Authorization.policy([
                    { action: Act.readAll, subject: Resource.identity },
                ]),
                handler: h.getAllSocialMedia,
                schema: {
                    request: {
                        params: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                            },
                        },
                    },
                },
            },
        ],
    };
};
