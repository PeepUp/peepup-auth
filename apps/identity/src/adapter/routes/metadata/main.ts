import type { IdentityRoutes, Routes } from "@/types/types";
import MetadataHandler from "../../handler/metadata";

export default (): Routes<IdentityRoutes> => ({
    routes: [
        {
            method: "GET",
            url: "/",
            handler: new MetadataHandler().docs,
        },
    ],
});
