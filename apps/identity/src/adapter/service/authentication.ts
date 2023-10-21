import type { LoginIdentityBody, RegisterIdentityBody } from "@/adapter/schema/auth";
import type TokenManagementService from "@/adapter/service/tokens/token";
import type { QueryWhitelistedTokenArgs } from "@/infrastructure/data-source/token.data-source";
import type { TokenContract } from "@/types/types";

import BadCredentialsException from "@/adapter/middleware/error/bad-credential-exception";
import BadRequestException from "@/adapter/middleware/error/bad-request-exception";
import UnauthorizedException from "@/adapter/middleware/error/unauthorized";
import TokenFactory from "@/domain/factory/token";
import PasswordUtil from "@/common/utils/password.util";
import type IdentityService from "./identity";

export default class AuthenticationService {
    constructor(
        private readonly identityService: IdentityService,
        private readonly tokenManagementService: TokenManagementService
    ) {}

    async registration(body: RegisterIdentityBody): Promise<void> {
        const { traits, password } = body;
        const hashed = await PasswordUtil.hash({
            _: password,
            salt: await PasswordUtil.generateSalt(32),
        });

        await this.identityService.create({
            email: traits.email as string,
            password: hashed,
            username: traits.username as string,
        });
    }

    async login(
        body: LoginIdentityBody,
        ip_address: string,
        device_id: string
    ): Promise<Readonly<TokenContract> | null> {
        const { password: _, traits } = body;
        const identity = await this.identityService.getIdentityByTraits(traits);

        if (!identity) throw new BadCredentialsException();
        if ("id" in identity === undefined) throw new BadCredentialsException();

        const { id, email, username, role, state, password: __ } = identity;

        await this.identityService.checkAndAutoActivateState(state, true, {
            email,
            username,
        });

        // verify password
        await this.identityService.verifyPassword({ _, __ });

        const payload = TokenFactory.simplePayloadIdentity({
            id,
            email,
            ip_address,
            device_id,
            role,
        });

        const [{ value: access_token }, { value: refresh_token }] = await Promise.all([
            this.tokenManagementService.generate(TokenFactory.accessToken(payload)),
            this.tokenManagementService.generate(TokenFactory.refreshToken(payload)),
        ]);

        if (!access_token || !refresh_token) {
            console.error("failed to generate token");
            console.error("@file: func login");
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
        const validate =
            await this.tokenManagementService.getAllTokenSessions(access_token);

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

        if (!token) throw new UnauthorizedException("Error: cannot verify Token!");

        const userTokens =
            await this.tokenManagementService.getAllTokenSessions(access_token);

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
