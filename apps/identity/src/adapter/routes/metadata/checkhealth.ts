import MetadataHandler from "../../handler/metadata";

import type { IdentityRoutes } from "@/types/types";

export default (): { routes: IdentityRoutes } => {
    const metadataHandler = new MetadataHandler();

    return {
        routes: [
            {
                method: "GET",
                url: "/health/alive",
                handler: metadataHandler.alive,
            },
            {
                method: "GET",
                url: "/health/ready",
                handler: metadataHandler.ready,
            },
            {
                method: "GET",
                url: "/health",
                handler: metadataHandler.health,
            },
        ],
    };
};
