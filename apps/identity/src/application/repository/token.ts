import type {
    AccessorTokenAndWhiteListedTokenAccessor,
    DataSourceSQLExtended,
    ID,
    Token,
    WhiteListedToken,
} from "@/types/types";

export class TokenRepository implements AccessorTokenAndWhiteListedTokenAccessor {
    constructor(private readonly tokenDataSource: DataSourceSQLExtended<Token>) {}

    generateToken(token: Token, identityId: ID): Promise<Token> {
        return this.tokenDataSource.create<ID>(token, identityId);
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
    verifyToken(token: string, identityId: ID): Promise<Token> {
        throw new Error("Method not implemented.");
    }

    rotateToken(token: Token, identityId: ID): Promise<Token> {
        return this.tokenDataSource.create<ID>(token, identityId);
    }

    revokeToken(token: string, identityId: ID): Promise<Token> {
        throw new Error("Method not implemented.");
    }

    revokeAllToken(identityId: ID): Promise<Token[]> {
        throw new Error("Method not implemented.");
    }

    getTokens(identityId: ID): Promise<Token[]> {
        throw new Error("Method not implemented.");
    }

    cleanUpExpiredToken(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    cleanupRevokedTokens(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    cleanUpExpiredAndRevokedTokens(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    validateTokenScope(token: Token, scope: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    whitelistToken(token: Token, identityId: ID): Promise<WhiteListedToken> {
        throw new Error("Method not implemented.");
    }

    removeFromWhiteList(token: Token): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getWhiteListedToken(token: Token): Promise<WhiteListedToken> {
        throw new Error("Method not implemented.");
    }

    getWhiteListedTokens(identityId: ID): Promise<WhiteListedToken[]> {
        throw new Error("Method not implemented.");
    }
}
