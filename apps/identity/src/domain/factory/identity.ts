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
            username: data.email.split("@")[0],
            emailVerified: null,
            role: RoleType.member,
            createdAt: new Date(),
            updatedAt: new Date(),
            password: data.password,
            state: IdentityStateTypes.unverified,
            phoneNumber: data.phoneNumber,
        } as Identity;
    }
}

export default IdentityFactory;
