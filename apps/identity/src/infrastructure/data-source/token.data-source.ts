import type { ID, Token, TokenDataSourceAdapter } from "@/types/types";
import { Prisma, PrismaClient } from "@prisma/client";

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

    async create<R>(token: Token, _identity: R): Promise<Readonly<Token>> {
        const result: Readonly<Token> = await this.dataSource.token.create({
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
                identity: {
                    connect: {
                        id: <string>token.identityId,
                    },
                },
                WhitelistedToken: {
                    create: {
                        identity: {
                            connect: {
                                id: <string>token.identityId,
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

    async update(id: ID, token: Token): Promise<Token> {
        const result: Readonly<Token> = await this.dataSource.token.update({
            where: {
                id: <number>id,
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

    async delete(id: ID): Promise<void> {
        await this.dataSource.token.delete({
            where: {
                id: <number>id,
            },
        });
    }
}

export default TokenStoreAdapter;
