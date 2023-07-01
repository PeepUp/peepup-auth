import MetadataHandler from "../../handler/metadata";

import type { IdentityRoutes } from "@/types/types";

export default (): { routes: IdentityRoutes } => ({
    routes: [
        {
            method: "GET",
            url: "/version",
            handler: new MetadataHandler().version,
        },
    ],
});
