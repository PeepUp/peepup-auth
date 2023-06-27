import IdentityService from "../adapter/service/identity";
import IdentityRepository from "../application/repository/identity";
import IdentityStoreAdapter from "./data-source/identity.data-source";
import { _prisma as prisma } from "./prisma";

import type { Dependencies } from "./dependencies";

const identityService = new IdentityService(
   new IdentityRepository(new IdentityStoreAdapter(prisma.prismaExtendedIdentityModel))
);

export const dependencies: Dependencies = {
   identityService,
};
