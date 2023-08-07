import type { IdentityRoutes, Routes } from "@/types/types";
import MetadataHandler from "../../handler/metadata";

export default (): Routes<IdentityRoutes> => ({
    routes: [
        {
            method: "GET",
            url: "/version",
            handler: new MetadataHandler().version,
        },
    ],
});
