import IdentityService from "@/adapter/service/identity";
import TokenRepository from "@/application/repository/token";
import TokenManagementService from "@/adapter/service/tokens/token";
import IdentityRepository from "@/application/repository/identity";
import AuthenticationService from "@/adapter/service/authentication";
import TokenStoreAdapter from "@/infrastructure/data-source/token.data-source";
import IdentityStoreAdapter from "@/infrastructure/data-source/identity.data-source";
import { WhiteListedTokenRepository } from "@/application/repository/whitelist-token";
import WhiteListedTokenStoreAdapter from "./data-source/whitelist-token.data-source";
import prisma from "./prisma";

import type { DependenciesService } from "./dependencies";

const tokenManagementService = new TokenManagementService(
    new TokenRepository(new TokenStoreAdapter(prisma)),
    new WhiteListedTokenRepository(new WhiteListedTokenStoreAdapter(prisma))
);

const identityService = new IdentityService(
    new IdentityRepository(new IdentityStoreAdapter(prisma)),
    tokenManagementService
);

const authenticationService = new AuthenticationService(
    identityService,
    tokenManagementService
);

const dependencies: DependenciesService = {
    identityService,
    authenticationService,
    tokenManagementService,
};

export default dependencies;
