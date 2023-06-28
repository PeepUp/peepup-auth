import { $ref as auth, authSchema } from "./auth.schema";
import { refIdentities as identities, identitiesSchema } from "./identity";

export const ref = {
    auth,
    identities,
};

export const schemas = [...authSchema, ...identitiesSchema];
