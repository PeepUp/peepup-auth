import AccountService from "@/adapter/service/account";
import IdentityService from "@/adapter/service/identity";

export interface DependenciesService {
    identityService: IdentityService;
}
