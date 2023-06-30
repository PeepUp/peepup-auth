import type AuthenticationService from "@/adapter/service/authentication";
import type IdentityService from "@/adapter/service/identity";
import type TokenManagementService from "@/adapter/service/token";

export interface DependenciesService {
    identityService: IdentityService;
    authenticationService: AuthenticationService;
    tokenManagementService: TokenManagementService;
}
