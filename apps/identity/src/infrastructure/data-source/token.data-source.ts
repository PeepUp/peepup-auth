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

    async query(query: QueryTokenArgs): Promise<Token[]> {
        const result: Readonly<Token>[] = await this.dataSource.token.findMany({
            where: query,
        });

        return result;
    }

    async findUnique(query: QueryTokenArgs): Promise<Readonly<Token> | null> {
        const result = await this.dataSource.token.findUnique({
            where: query,
        });

        return result;
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
        console.log({ data, identity });
        const result: Readonly<Token> = await this.dataSource.token.create({
            data: {
                value: data.value,
                tokenTypes: data.tokenTypes,
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

    async findMany(
        identityId: ID,
        tokenValue: string
    ): Promise<Readonly<Token>[] | null> {
        const result: Readonly<Token>[] | null = await this.dataSource.token.findMany({
            where: {
                value: tokenValue,
                identity: {
                    id: <string>identityId,
                },
            },
        });
        return result;
    }

    async find(identityId: ID): Promise<Readonly<Token> | null> {
        const result: Readonly<Token> | null =
            await this.dataSource.token.findFirstOrThrow({
                where: {
                    identity: {
                        id: <string>identityId,
                    },
                },
            });

        return result;
    }

    async update(jti: ID, token: Token): Promise<Token> {
        const result: Readonly<Token> = await this.dataSource.token.update({
            where: {
                jti: <string>jti,
            },
            data: {
                value: token.value,
                tokenTypes: token.tokenTypes,
                header: <Prisma.JsonObject>token.header,
                jti: token.jti,
                payload: <Prisma.JsonObject>token.payload,
                kid: token.kid,
                nbf: token.nbf,
                tokenStatus: token.tokenStatus,
                createdAt: new Date(token.createdAt),
                expirationTime: token.expirationTime,
                expires_at: token.expires_at,
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
}

export default TokenStoreAdapter;
