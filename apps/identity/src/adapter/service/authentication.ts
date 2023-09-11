import type { TokenContract } from "@/types/types";
import type IdentityRepository from "@/application/repository/identity";
import type TokenManagementService from "./token";
import type { LoginIdentityBody, RegisterIdentityBody } from "../schema/auth";
import type { QueryWhitelistedTokenArgs } from "../../infrastructure/data-source/token.data-source";

import * as utils from "../../common/utils/utils";
import TokenFactory from "../../domain/factory/token";
import IdentityFactory from "../../domain/factory/identity";
import UnauthorizedException from "../middleware/error/unauthorized";
import BadRequestException from "../middleware/error/bad-request-exception";
import ResourceAlreadyExistException from "../middleware/error/resource-exists";
import BadCredentialsException from "../middleware/error/bad-credential-exception";

export default class AuthenticationService {
    constructor(
        private readonly identityRepository: IdentityRepository,
        private readonly tokenManagementService: TokenManagementService
    ) {}

    async registration(body: RegisterIdentityBody): Promise<void> {
        const { traits, password } = body;
        const existingIdentity = await this.identityRepository.getIdentity(traits);

        if (existingIdentity) {
            throw new ResourceAlreadyExistException("identity already exists");
        }

        const hashed = await utils.passwordUtils.hash({
            _: password,
            salt: await utils.passwordUtils.generateSalt(32),
        });
        const identity = IdentityFactory.createIdentity({
            email: traits.email as string,
            password: hashed,
            username: traits.username as string,
        });
        const data = await this.identityRepository.create(identity);

        if (!data) throw new Error("Error: cannot creating identity");
    }

    async login(
        body: LoginIdentityBody,
        ip_address: string,
        device_id: string
    ): Promise<Readonly<TokenContract> | null> {
        const { traits, password } = body;
        const identity = await this.identityRepository.getLoginIdentity({
            where: traits,
            data: { password },
        });

        if (!identity) {
            throw new BadCredentialsException(
                "Please cross check again! username, email or password are incorrect!"
            );
        }

        if ("id" in identity === undefined) {
            throw new BadCredentialsException(
                "Please cross check again! username, email or password are incorrect!"
            );
        }

        const tokenPayload = Object.freeze({
            id: identity.id,
            email: identity.email,
            resource: identity.role,
            ip_address,
            device_id,
        });

        const verify = await utils.passwordUtils.verify({
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
                TokenFactory.createAccessToken(tokenPayload)
            ),
            this.tokenManagementService.generate(
                TokenFactory.createRefreshToken(tokenPayload)
            ),
        ]);

        if (!access_token || !refresh_token) {
            console.log("failed to generate token");
            console.log("@file: func login");
            throw new BadRequestException(
                "Error: we have some problem, server cannot respond right now!"
            );
        }

        return {
            access_token,
            refresh_token,
        };
    }

    async logout(access_token: string): Promise<void | Error> {
        if (!access_token) {
            throw new BadRequestException("Untracked credential, you can login again!");
        }

        const authorization = this.tokenManagementService.splitAuthzHeader(access_token);
        const validate = await this.tokenManagementService.getTokenSessions(access_token);

        if (!validate || (validate && !validate?.length)) {
            throw new BadRequestException("Untracked credential, you can login again!");
        }

        const decoded = await this.tokenManagementService.decodeToken(authorization);

        if (!decoded) throw new UnauthorizedException("Error: cannot validate token!");

        const tokenJtiAndIdentityId: QueryWhitelistedTokenArgs = {
            tokenId_identityId: {
                tokenId: decoded.jti as string,
                identityId: decoded.id as string,
            },
        };

        const token = await this.tokenManagementService.verifyToken(
            authorization,
            tokenJtiAndIdentityId
        );

        if (!token) throw new UnauthorizedException("Error: cannot verifyToken token!");

        const userTokens =
            await this.tokenManagementService.getTokenSessions(access_token);

        if (!userTokens)
            throw new UnauthorizedException("Error: cannot get token sessions!");

        const refreshTokens = userTokens?.filter((t) => t.type === "refresh").at(0);
        const revoked = await Promise.all([
            this.tokenManagementService.revokeToken(decoded.jti as string),
            this.tokenManagementService.revokeToken(refreshTokens?.jti as string),
        ]);

        // deleted from whitelist
        await Promise.all([
            this.tokenManagementService.deleteWhitelistedToken(tokenJtiAndIdentityId),
            this.tokenManagementService.deleteWhitelistedToken({
                tokenId_identityId: {
                    tokenId: refreshTokens?.jti as string,
                    identityId: decoded.id as string,
                },
            }),
        ]);

        if (!revoked) throw new BadCredentialsException("Error: cannot revoke token!");
    }
}
