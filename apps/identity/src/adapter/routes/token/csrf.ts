import TokenHandler from "@/adapter/handler/token";
import TokenManagementService from "@/adapter/service/tokens/token";

import type { IdentityRoutes, Routes } from "@/types/types";

export default (tokenService: TokenManagementService): Routes<IdentityRoutes> => {
    const handler = new TokenHandler(tokenService);

    return {
        routes: [
            {
                method: "GET",
                url: "/tokens/csrf",
                handler: handler.generateCSRFToken,
            },
        ],
    };
};
