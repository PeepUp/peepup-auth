import type { Routes, IdentityRoutes } from "@/types/types";
import MetadataHandler from "@/adapter/handler/metadata";

export default (): Routes<IdentityRoutes> => ({
    routes: [
        {
            method: "GET",
            url: "/openapi/schemas/:fn",
            handler: new MetadataHandler().openapi,
            schema: {
                request: {
                    params: {
                        fn: { type: "string" },
                    },
                },
            },
        },
    ],
});
