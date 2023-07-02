import type { IdentityRoutes } from "@/types/types";
import MetadataHandler from "../../handler/metadata";


export default (): { routes: IdentityRoutes } => ({
    routes: [
        {
            method: "GET",
            url: "/version",
            handler: new MetadataHandler().version,
        },
    ],
});
