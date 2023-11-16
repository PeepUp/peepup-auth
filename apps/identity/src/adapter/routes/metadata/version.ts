import type { IdentityRoutes, Routes } from "@/types/types";
import MetadataHandler from "@/adapter/handler/metadata";

export default (): Routes<IdentityRoutes> => ({
    routes: [
        {
            method: "GET",
            url: "/version",
            handler: new MetadataHandler().version,
        },
    ],
});
