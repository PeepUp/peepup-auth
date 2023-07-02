/* eslint-disable */
import type { ID, Token, TokenAccessor, WhiteListedToken } from "@/types/types";
import type TokenStoreAdapter from "@/infrastructure/data-source/token.data-source";
import type {
    QueryTokenArgs,
    QueryWhitelistedTokenArgs,
} from "@/infrastructure/data-source/token.data-source";

export class TokenRepository implements TokenAccessor {
    constructor(private readonly tokenDataSource: TokenStoreAdapter) {}

    async revokeAllToken(identityId: ID): Promise<Token[]> {
        throw new Error("Method not implemented.");
    }

    async saveToken(token: Token, identityId: ID): Promise<Token> {
        return this.tokenDataSource.create<ID>(token, identityId);
    }

    async findToken(query: QueryTokenArgs): Promise<Readonly<Token> | null> {
        return this.tokenDataSource.findUnique(query);
    }

    async WhitelistedToken(
        token: QueryWhitelistedTokenArgs
    ): Promise<Readonly<Token> | null> {
        return this.tokenDataSource.findUniqueInWhiteListed(token);
    }

    // async findTokens(identityId: ID): Promise<Readonly<Tokens>[] | null> {
    //     return await this.tokenDataSource.findMany(identityId);
    // }

    /**
     * @todo
     *  - [SOON] this not implemented in this TokenRepository Class
     *  - [SOON] @file ServiceTokenManagement.ts
     *     - extract infromation inside old token
     *     - (if needed) assign extracted information from old token to new token
     *     - sign new token
     *     - if expiresIn is not null, set expirationTime from old range time to new token
     *     - add to the database
     *     - associate new token to identityId
     *     - set status of old token to revoked
     *
     */
    async generateToken(token: Token, identityId: ID): Promise<Token> {
        return this.tokenDataSource.create<ID>(token, identityId);
    }

    async verifyToken(token: Token, identityId: ID): Promise<Token> {
        return this.tokenDataSource.create<ID>(token, identityId);
    }

    async rotateToken(token: Token, identityId: ID): Promise<Token> {
        return this.tokenDataSource.create<ID>(token, identityId);
    }

    async revokeToken(token: Token, identityId: ID): Promise<void> {
        await this.tokenDataSource.update(identityId, token);
        throw new Error("Method not implemented.");
    }

    async getTokens(identityId: ID): Promise<Token[]> {
        throw new Error("Method not implemented.");
    }

    async cleanUpExpiredToken(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async cleanupRevokedTokens(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async cleanUpExpiredAndRevokedTokens(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async validateTokenScope(token: Token, scope: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async whitelistToken(token: Token, identityId: ID): Promise<WhiteListedToken> {
        throw new Error("Method not implemented.");
    }

    async removeFromWhiteList(token: Token): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getWhiteListedTokens(identityId: ID): Promise<WhiteListedToken[]> {
        throw new Error("Method not implemented.");
    }
}
