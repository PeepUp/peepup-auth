/* eslint-disable class-methods-use-this */
import type { Prisma, PrismaClient } from "@prisma/client";
import type { ID, Token, TokenDataSourceAdapter } from "@/types/types";

/**
 * @todo:
 *  ☐ check task on: @/types/prisma.d.ts
 *  ☐ [SOON] delete console.dir on function findUniqueLogin
 *
 */

export type QueryTokenArgs = Prisma.TokenWhereUniqueInput;
export type QueryWhitelistedTokenArgs = Prisma.WhitelistedTokenWhereUniqueInput;

class TokenStoreAdapter implements TokenDataSourceAdapter {
    constructor(private readonly dataSource: PrismaClient) {}

    async query(
        query: Partial<Token | Token[]>
    ): Promise<Token | Token[] | (Token | Token[])[] | null> {
        console.log(query);
        throw new Error("Method not implemented.");
    }

    async update(id: ID, data: Token): Promise<Readonly<Token> | null> {
        const result = await this.dataSource.token.update({
            where: {
                jti: <string>id,
            },
            data: {
                value: data.value,
                type: data.type,
                header: <Prisma.JsonObject>data.header,
                jti: data.jti,
                payload: <Prisma.JsonObject>data.payload,
                kid: data.kid,
                nbf: data.nbf,
                tokenStatus: data.tokenStatus,
                createdAt: new Date(data.createdAt),
                expirationTime: data.expirationTime,
                expires_at: data.expires_at,
            },
        });

        return result ?? null;
    }

    async revoke(jti: ID): Promise<Readonly<Token> | null> {
        const result = await this.dataSource.token.update({
            where: {
                jti: <string>jti,
            },
            data: {
                tokenStatus: "revoked",
            },
        });

        return result ?? null;
    }

    async findUnique(query: QueryTokenArgs): Promise<Readonly<Token> | null> {
        const result = await this.dataSource.token.findUnique({
            where: query,
        });

        return result;
    }

    async getWhitelistedTokens(identityId: ID): Promise<Readonly<Token>[] | null> {
        const results = await this.dataSource.whitelistedToken.findMany({
            where: {
                identityId: <string>identityId,
            },
            include: {
                token: true,
            },
        });

        const tokens: Readonly<Token>[] | null =
            results.length > 0 ? results.map((result) => <Token>result.token) : null;

        return tokens ?? null;
    }

    async findUniqueInWhiteListed(
        query: QueryWhitelistedTokenArgs
    ): Promise<Readonly<Token> | null> {
        const result = await this.dataSource.whitelistedToken.findUnique({
            include: {
                token: true,
            },
            where: query,
        });

        if (result === null) return null;
        return result.token ?? null;
    }

    async findFirst(query: QueryTokenArgs): Promise<Readonly<Token> | null> {
        const result: Readonly<Token> | null = await this.dataSource.token.findFirst({
            where: query,
        });

        return result;
    }

    async create<R>(data: Token, identity: R): Promise<Readonly<Token>> {
        const result = await this.dataSource.token.create({
            data: {
                value: data.value,
                type: data.type,
                header: <Prisma.JsonObject>data.header,
                jti: data.jti,
                payload: <Prisma.JsonObject>data.payload,
                kid: data.kid,
                nbf: data.nbf,
                tokenStatus: data.tokenStatus,
                createdAt: new Date(data.createdAt),
                expirationTime: data.expirationTime,
                expires_at: data.expires_at,
                identity: {
                    connect: {
                        id: <string>identity,
                    },
                },
                WhitelistedToken: {
                    create: {
                        identity: {
                            connect: {
                                id: <string>data.identityId,
                            },
                        },
                    },
                },
            },
        });

        return result;
    }

    async createMany<R>(data: Token[], identity: R): Promise<void> {
        const tokens: Prisma.TokenCreateManyInput[] = data.map((token) => ({
            value: token.value,
            expirationTime: token.expirationTime,
            type: token.type,
            expires_at: token.expires_at,
            header: <Prisma.JsonObject>token.header,
            jti: token.jti,
            payload: <Prisma.JsonObject>token.payload,
            kid: token.kid,
            nbf: token.nbf,
            tokenStatus: token.tokenStatus,
            createdAt: new Date(token.createdAt),
            identity: {
                connect: {
                    id: identity,
                },
            },
            WhitelistedToken: {
                create: {
                    identity: {
                        connect: {
                            id: token.identityId,
                        },
                    },
                },
            },
        }));

        await this.dataSource.token.createMany({
            data: tokens,
        });
    }

    async findMany(
        identityId: ID,
        tokenValue: string
    ): Promise<Readonly<Token>[] | null> {
        const result: Readonly<Token>[] | null = await this.dataSource.token.findMany({
            where: {
                OR: [
                    { value: tokenValue },
                    {
                        identity: {
                            id: identityId as string,
                        },
                    },
                ],
            },
        });

        return result;
    }

    async find(identityId: ID): Promise<Readonly<Token> | null> {
        const result: Readonly<Token> | null = await this.dataSource.token.findFirst({
            where: {
                identity: {
                    id: <string>identityId,
                },
            },
        });

        return result;
    }

    async delete(jti: ID): Promise<void> {
        await this.dataSource.token.delete({
            where: {
                jti: <string>jti,
            },
        });
    }

    async deleteWhitelistedToken(query: QueryWhitelistedTokenArgs): Promise<void> {
        await this.dataSource.whitelistedToken.delete({
            where: query,
        });
    }
}

export default TokenStoreAdapter;
