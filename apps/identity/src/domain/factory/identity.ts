import type { RegisterIdentityBody } from "@/types/types";
import type { Identity } from "../entity/identity";

class IdentityFactory {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static createIdentity(identity: RegisterIdentityBody): Identity {
        return <Identity>{
            email: <string>identity.email,
            password: identity.password,
            avatar: "",
            username: <string>identity.username ?? <string>identity.email?.split("@")[0],
            lastName: "",
            firstName: "",
            phoneNumber: null,
            state: "active",
            providerId: null,
            emailVerified: null,
            isAdmin: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}

export default IdentityFactory;
