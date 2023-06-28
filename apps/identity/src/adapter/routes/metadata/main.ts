import MetadataHandler from "../../handler/metadata";

import type { IdentityRoutes } from "@/types/types";

export default (): { routes: IdentityRoutes } => {
    return {
        routes: [
            {
                method: "GET",
                url: "/",
                handler: new MetadataHandler().docs,
            },
        ],
    };
};
