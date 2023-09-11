import prisma from "./prisma";

import IdentityService from "../adapter/service/identity";
import TokenManagementService from "../adapter/service/token";
import AuthenticationService from "../adapter/service/authentication";

import TokenStoreAdapter from "./data-source/token.data-source";
import IdentityStoreAdapter from "./data-source/identity.data-source";

import TokenRepository from "../application/repository/token";
import IdentityRepository from "../application/repository/identity";

import type { DependenciesService } from "./dependencies";
import WhiteListedTokenStoreAdapter from "./data-source/whitelist-token.data-source";
import { WhiteListedTokenRepository } from "../application/repository/whitelist-token";

const tokenManagementService = new TokenManagementService(
    new TokenRepository(new TokenStoreAdapter(prisma)),
    new WhiteListedTokenRepository(new WhiteListedTokenStoreAdapter(prisma))
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
