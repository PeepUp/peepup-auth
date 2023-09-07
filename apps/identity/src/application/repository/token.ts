/* eslint-disable */
import type {
    QueryTokenArgs,
    QueryWhitelistedTokenArgs,
} from "@/infrastructure/data-source/token.data-source";
import type { ID, Token, TokenAccessor, WhiteListedToken } from "@/types/types";
import type TokenStoreAdapter from "@/infrastructure/data-source/token.data-source";

class TokenRepository implements TokenAccessor {
    constructor(private readonly tokenDataSource: TokenStoreAdapter) {}

    async getToken(query: QueryTokenArgs): Promise<Readonly<Token> | null> {
        return await this.tokenDataSource.findUnique(query);
    }

    async getTokens(identityId: ID, value?: string): Promise<Readonly<Token>[] | null> {
        return await this.tokenDataSource.findMany(identityId, value ?? "");
    }

    async findRelatedTokens(args: TokenRelatedArgs): Promise<Readonly<Token> | null> {
        return await this.tokenDataSource.findRelatedTokens(args);
    }

    async revokeToken(jti: ID): Promise<Readonly<Token> | null> {
        return await this.tokenDataSource.revoke(jti);
    }

    async saveToken(token: Token, identityId: ID): Promise<Token> {
        return await this.tokenDataSource.create<ID>(token, identityId);
    }

    async saveTokens(token: Token[], identityId: ID): Promise<readonly Token[] | null> {
        throw new Error("Method not implemented.");
    }

    async WhitelistedToken(
        query: QueryWhitelistedTokenArgs
    ): Promise<Readonly<Token> | null> {
        return this.tokenDataSource.findUniqueInWhiteListed(query);
    }

    async getWhitelistedTokens(identityId: ID): Promise<Readonly<Token>[] | null> {
        return this.tokenDataSource.getWhitelistedTokens(identityId);
    }

    async deleteWhitelistedToken(query: QueryWhitelistedTokenArgs): Promise<void> {
        return await this.tokenDataSource.deleteWhitelistedToken(query);
    }

    async revokeAllToken(identityId: ID): Promise<Token[]> {
        throw new Error("Method not implemented.");
    }

    async updateWhiteListedToken(
        token: Token,
        newToken: Token
    ): Promise<Readonly<Token> | null> {
        throw new Error("Method not implemented.");
    }

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

    /*     async revokeToken(token: Token, identityId: ID): Promise<void> {
        await this.tokenDataSource.update(token, token);
        throw new Error("Method not implemented.");
    } */

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

export type TokenRelatedArgs = {
    device_id: string;
    ip_address: string;
};

export default TokenRepository;
