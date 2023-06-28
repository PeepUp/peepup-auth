import { $ref as auth, schemas as authSchema } from "./auth.schema";
import { $ref as identities, schemas as identitiesSchema } from "./identity";

export const ref = {
    auth,
    identities,
};

export const schemas = [...authSchema, ...identitiesSchema];
