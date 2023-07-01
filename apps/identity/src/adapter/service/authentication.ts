import type { Identity } from "@/domain/entity/identity";
import type IdentityRepository from "@/application/repository/identity";
import type { Token } from "@/types/types";
import { passwordUtils } from "../../common";
import {
    BadCredentialsException,
    ResourceAlreadyExistException,
} from "../middleware/error/common";
import { LoginIdentityBody, RegisterIdentityBody } from "../schema/auth.schema";

import type TokenManagementService from "./token";

export default class AuthenticationService {
    constructor(
        private readonly identityRepository: IdentityRepository,
        private readonly tokenManagementService: TokenManagementService
    ) {}

    async registration(body: RegisterIdentityBody): Promise<void> {
        const { traits, password } = body;

        const existingIdentity = await this.identityRepository.getIdentity<Identity>(
            traits
        );

        if (existingIdentity !== null) {
            throw new ResourceAlreadyExistException("identity already exists");
        }

        const hashed = await passwordUtils.hash({
            _: password,
            salt: await passwordUtils.generateSalt(32),
        });

        const identity: Identity = {
            id: "",
            email: <string>traits.email,
            password: hashed,
            avatar: "",
            username: <string>traits.username ?? <string>traits.email?.split("@")[0],
            lastName: "",
            firstName: "",
            phoneNumber: null,
            state: "active",
            providerId: null,
            emailVerified: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const data = await this.identityRepository.create<Identity>(identity);

        if (!data) {
            throw new Error("Error: cannot creating identity");
        }
    }

    async login(body: LoginIdentityBody): Promise<Readonly<{ access: Token }> | null> {
        const { traits, password } = body;
        const identity = await this.identityRepository.getLoginIdentity<Identity>({
            where: traits,
            data: { password },
        });

        if (identity === null) return null;

        const verify = await passwordUtils.verify({
            _: password,
            __: identity.password,
        });

        if (!verify)
            throw new BadCredentialsException(
                "Please check credentials of password, username, email are incorrect"
            );

        const token = await this.tokenManagementService.generateToken(
            {
                email: <string>identity.email,
                id: <string>identity.id,
                resource: "profile,post,event",
            },
            "access"
        );

        if (!token) {
            throw new Error("Error: cannot generating token");
        }

        return {
            access: token,
        };
    }
}
