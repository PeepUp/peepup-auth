import { IdentityStateTypes, RoleType } from "@/common/constant";

import type { Identity } from "@/domain/entity/identity";
import type { RegisterIdentityBody } from "@/types/types";

class IdentityFactory {
    public static defaultIdentity(data: RegisterIdentityBody): Readonly<Identity> {
        return {
            avatar: "",
            lastName: "",
            firstName: "",
            providerId: null,
            email: data.email,
            phoneNumber: null,
            emailVerified: null,
            role: RoleType.member,
            createdAt: new Date(),
            updatedAt: new Date(),
            password: data.password,
            state: IdentityStateTypes.unverified,
            username: data.username ?? data.email?.split("@")[0],
        } as Identity;
    }
}

export default IdentityFactory;
