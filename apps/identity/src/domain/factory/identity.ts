import { IdentityStateTypes, RoleType } from "@/common/constant";

import type { Identity } from "@/domain/entity/identity";
import type { RegisterIdentityBody } from "@/types/types";

class IdentityFactory {
    public static createIdentity(identity: RegisterIdentityBody): Identity {
        return <Identity>{
            email: <string>identity.email,
            password: identity.password,
            avatar: "",
            username: <string>identity.username ?? <string>identity.email?.split("@")[0],
            lastName: "",
            firstName: "",
            phoneNumber: null,
            state: IdentityStateTypes.unverified,
            providerId: null,
            emailVerified: null,
            role: RoleType.member,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}

export default IdentityFactory;
