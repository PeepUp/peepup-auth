import type { TokenContract } from "@/types/types";
import type { Identity } from "@/domain/entity/identity";
import type IdentityRepository from "@/application/repository/identity";
import { passwordUtils } from "../../common/utils/utils";
import TokenFactory from "../../domain/factory/token";
import IdentityFactory from "../../domain/factory/identity";
import ResourceAlreadyExistException from "../middleware/error/resource-exists";
import BadCredentialsException from "../middleware/error/bad-credential-exception";

import type TokenManagementService from "./token";
import type { LoginIdentityBody, RegisterIdentityBody } from "../schema/auth";

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

        if (existingIdentity) {
            throw new ResourceAlreadyExistException("identity already exists");
        }

        const hashed = await passwordUtils.hash({
            _: password,
            salt: await passwordUtils.generateSalt(32),
        });

        const identity = IdentityFactory.createIdentity({
            email: traits.email as string,
            password: hashed,
            username: traits.username as string,
        });

        const data = await this.identityRepository.create<Identity>(identity);

        if (!data) throw new Error("Error: cannot creating identity");
    }

    async login(body: LoginIdentityBody): Promise<Readonly<TokenContract> | null> {
        const { traits, password } = body;
        const identity = await this.identityRepository.getLoginIdentity<Identity>({
            where: traits,
            data: { password },
        });

        if (!identity) {
            throw new BadCredentialsException(
                "Please cross check again! username, email or password are not exist!"
            );
        }

        const identityPayload = Object.freeze({
            id: identity.id,
            email: identity.email,
            resource: "profile",
        });

        const verify = await passwordUtils.verify({
            _: password,
            __: identity.password,
        });

        if (!verify) {
            throw new BadCredentialsException(
                "Please cross check again! username, email or password are incorrect!"
            );
        }

        const [{ value: access_token }, { value: refresh_token }] = await Promise.all([
            this.tokenManagementService.generateToken(
                TokenFactory.createAccessToken(identityPayload)
            ),
            this.tokenManagementService.generateToken(
                TokenFactory.createRefreshToken(identityPayload)
            ),
        ]);

        if (!access_token) throw new Error("Error: cannot generating token!");

        return {
            access_token,
            refresh_token,
        };
    }
}
