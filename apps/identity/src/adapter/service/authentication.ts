import type { TokenContract } from "@/types/types";
import type { Identity } from "@/domain/entity/identity";
import type IdentityRepository from "@/application/repository/identity";
import type TokenManagementService from "./token";
import type { LoginIdentityBody, RegisterIdentityBody } from "../schema/auth";

import TokenFactory from "../../domain/factory/token";
import { passwordUtils } from "../../common/utils/utils";
import IdentityFactory from "../../domain/factory/identity";
import UnauthorizedException from "../middleware/error/unauthorized";
import ResourceAlreadyExistException from "../middleware/error/resource-exists";
import BadCredentialsException from "../middleware/error/bad-credential-exception";
import { QueryWhitelistedTokenArgs } from "../../infrastructure/data-source/token.data-source";

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

    async login(
        body: LoginIdentityBody,
        ip_address: string,
        device_id: string
    ): Promise<Readonly<TokenContract> | null> {
        const { traits, password } = body;
        const identity = await this.identityRepository.getLoginIdentity<Identity>({
            where: traits,
            data: { password },
        });

        console.log({
            ip_address,
            device_id,
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
            this.tokenManagementService.generate(
                TokenFactory.createAccessToken(identityPayload)
            ),
            this.tokenManagementService.generate(
                TokenFactory.createRefreshToken(identityPayload)
            ),
        ]);

        if (!access_token) throw new Error("Error: cannot generating token!");

        return {
            access_token,
            refresh_token,
        };
    }

    async logout(access_token: string): Promise<void> {
        const authorization: string[] = access_token.split(" ");

        if (authorization[0] !== "Bearer" && authorization[1] === undefined) {
            throw new UnauthorizedException("Error: invalid token!");
        }

        if (authorization[1] === undefined) {
            throw new UnauthorizedException("Error: invalid token!");
        }

        const decoded = await this.tokenManagementService.decodeToken(authorization[1]);

        if (!decoded) {
            throw new UnauthorizedException("Error: invalid token!");
        }

        const tokenJtiAndIdentityId: QueryWhitelistedTokenArgs = {
            tokenId_identityId: {
                tokenId: decoded.jti as string,
                identityId: decoded.id as string,
            },
        };

        const token = await this.tokenManagementService.verifyToken(
            authorization[1],
            tokenJtiAndIdentityId
        );

        console.log(token);

        const revoked = await this.tokenManagementService.revokeToken(
            decoded.jti as string
        );

        const deleted = await this.tokenManagementService.deleteWhitelistedToken(
            tokenJtiAndIdentityId
        );

        console.log(deleted);

        if (!revoked) throw new Error("Error: cannot revoke token!");
    }
}
