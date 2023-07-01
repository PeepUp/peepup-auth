import ResourceAlreadyExistException from "../../middleware/error/resource-exists";

import type { IdentityOmitted } from "@/adapter/service/identity";
import type tokenManagementService from "@/adapter/service/token";
import type IdentityRepository from "@/application/repository/identity";
import type { Identity } from "@/domain/entity/identity";
import type {
    LoginIdentityBody,
    RegisterIdentityBody,
} from "@/adapter/schema/auth.schema";

export default class AuthenticationService {
    constructor(
        private readonly identityRepository: IdentityRepository,
        private readonly tokenManagementService: tokenManagementService
    ) {}

    async registration(body: RegisterIdentityBody): Promise<void> {
        const { traits, password } = body;

        const existingIdentity = await this.identityRepository.getIdentity<Identity>(
            traits
        );

        if (existingIdentity !== null) {
            throw new ResourceAlreadyExistException("identity already exists");
        }

        const identity: Identity = {
            email: <string>traits.email,
            password,
            avatar: "",
            username:
                <string>traits.username ?? (<string>traits.email?.split("@")[0] || null),
            lastName: "",
            firstName: "",
            phoneNumber: "",
            state: "active",
            emailVerified: null,
            providerId: null,
        };

        const data = await this.identityRepository.create<Identity>(identity);

        if (!data) {
            throw new Error("Error: cannot creating identity");
        }
    }

    async login(body: LoginIdentityBody): Promise<Readonly<IdentityOmitted> | null> {
        const { traits, password } = body;
        const identity = await this.identityRepository.getLoginIdentity<Identity>({
            where: traits,
            data: { password },
        });

        if (identity === null) return null;

        return identity;
    }

    async getIdentities(): Promise<Readonly<IdentityOmitted>[] | null> {
        const data = await this.identityRepository.getIdentities();

        if (!data) return data;

        const result = data.map((identity) => {
            const {
                password,
                providerId,
                phoneNumber,
                updatedAt,
                ...rest
            }: typeof identity = identity;

            return rest;
        });

        return result ?? null;
    }
}
