import AuthenticationService from "../adapter/service/authentication";
import IdentityService from "../adapter/service/identity";
import TokenManagementService from "../adapter/service/token";
import IdentityRepository from "../application/repository/identity";
import { TokenRepository } from "../application/repository/token";
import IdentityStoreAdapter from "./data-source/identity.data-source";
import TokenStoreAdapter from "./data-source/token.data-source";
import type { DependenciesService } from "./dependencies";
import prisma from "./prisma";

const tokenManagementService = new TokenManagementService(
    new TokenRepository(new TokenStoreAdapter(prisma))
);

const authenticationService = new AuthenticationService(
    new IdentityRepository(new IdentityStoreAdapter(prisma)),
    tokenManagementService
);

const identityService = new IdentityService(
    new IdentityRepository(new IdentityStoreAdapter(prisma)),
    tokenManagementService
);

const dependencies: DependenciesService = {
    identityService,
    authenticationService,
    tokenManagementService,
};

export default dependencies;
