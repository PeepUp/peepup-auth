import { POST_REGISTER_IDENTITY_BODY_SCHEMA } from "@/adapter/schema/auth";

import type { RegisterIdentityBody } from "@/adapter/schema/auth";
import type TokenManagementService from "@/adapter/service/tokens/token";
import type { QueryWhitelistedTokenArgs } from "@/infrastructure/data-source/token.data-source";
import type { LoginServiceArgs, TokenContract } from "@/types/types";

import BadCredentialsException from "@/adapter/middleware/errors/bad-credential-exception";
import BadRequestException from "@/adapter/middleware/errors/bad-request-exception";
import UnauthorizedException from "@/adapter/middleware/errors/unauthorized";
import TokenFactory from "@/domain/factory/token";
import PasswordUtil from "@/common/utils/password.util";
import type IdentityService from "./identity";

export default class AuthenticationService {
    constructor(
        private readonly identityService: IdentityService,
        private readonly tokenManagementService: TokenManagementService
    ) {}

    /*
     * TODO:
     *  ☐ handle the traits email or phone number
     *     - if email, then send email verification
     *     - if phone number, then send sms verification
     *
     * */
    async registration(body: RegisterIdentityBody): Promise<void> {
        const { traits, password: _ } = body;

        await POST_REGISTER_IDENTITY_BODY_SCHEMA.parseAsync(body);
        await this.identityService.create({
            email: traits.email as string,
            password: await PasswordUtil.hash({
                _,
                salt: await PasswordUtil.generateSalt(32),
            }),
            phoneNumber: traits.phone_number as string,
        });
    }

    async checkEmailExist(email: string): Promise<boolean> {
        const identity = await this.identityService.getIdentityByTraits({ email });
        return !!identity;
    }

    async login(data: LoginServiceArgs & { fgp: string }): Promise<Readonly<TokenContract> | null> {
        const {
            body: { password: _, traits },
            ip_address,
            device_id,
            fgp: fingerprint,
        } = data;

        const identity = await this.identityService.getIdentityByTraits(traits);

        if (!identity || Object.values(identity).length === 0) {
            throw new BadCredentialsException();
        }

        console.log({ this_identity_try_to_login: { ...identity } });

        const { id, email, username, role, state, password: __ } = identity;
        const traitsIdentity = { email, username };

        await this.identityService.checkAndAutoActivateState({
            state,
            activate: true,
            traits: traitsIdentity,
        });
        await this.identityService.verifyPassword({ _, __ });

        const payload = TokenFactory.simplePayloadIdentity({
            id,
            role,
            email,
            device_id,
            ip_address,
            fingerprint,
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
        if (!access_token || access_token.length === 0) {
            throw new BadRequestException("Untracked credential, you can login again!");
        }

        const authorization = this.tokenManagementService.splitAuthzHeader(access_token);
        const validate = await this.tokenManagementService.getAllTokenSessions(access_token);

        if (!validate || (validate && !validate?.length)) {
            throw new BadRequestException("Untracked credential, you can login again!");
        }

        const decoded = this.tokenManagementService.decodeToken(authorization);

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

        const userTokens = await this.tokenManagementService.getAllTokenSessions(access_token);

        if (!userTokens) throw new UnauthorizedException("Error: cannot get token sessions!");

        const refreshTokens = userTokens?.filter((t) => t.type === "refresh").at(0);

        console.log({
            access: token,
            refresh: refreshTokens,
        });

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
                    identityId: decoded?.id as string,
                },
            }),
        ]);

        if (!revoked) throw new BadCredentialsException("Error: cannot revoke token!");
    }
}
