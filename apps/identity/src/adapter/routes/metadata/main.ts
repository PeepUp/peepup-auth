import MetadataHandler from "../../handler/metadata";

import type { IdentityRoutes, Routes } from "@/types/types";

export default (): Routes<IdentityRoutes> => ({
    routes: [
        {
            method: "GET",
            url: "/",
            handler: new MetadataHandler().docs,
        },
    ],
});
