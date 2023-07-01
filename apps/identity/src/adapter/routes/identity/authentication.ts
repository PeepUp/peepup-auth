/* eslint-disable */

import { ResourceAlreadyExistException } from "@/adapter/middleware/error/common";
import { LoginIdentityBody, RegisterIdentityBody } from "@/adapter/schema/auth.schema";
import { IdentityOmitted } from "@/adapter/service/identity";
import tokenManagementService from "@/adapter/service/token";
import IdentityRepository from "@/application/repository/identity";
import { Identity } from "@/domain/entity/identity";

export default class AuthenticationService {
    constructor(
        private readonly identityRepository: IdentityRepository,
        private readonly tokenManagementService: tokenManagementService
    ) {}

    async registration(body: RegisterIdentityBody): Promise<void> {
        const { traits, password, method } = body;

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
        const { traits, password, method, password_identifier } = body;
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
                ...result
            }: typeof identity = identity;

            return result;
        });

        return result ?? null;
    }
}
