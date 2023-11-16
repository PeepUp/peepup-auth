/* eslint-disable class-methods-use-this */
import { TokenStatusTypes } from "@prisma/client";

import type { TokenQueryArgs } from "@/types/token";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { ID, Token, TokenDataSourceAdapter } from "@/types/types";
import type { TokenRelatedArgs } from "@/application/repository/token";
import type { PrismaProviderClient } from "@/infrastructure/database/prisma-provider";

/**
 * @todo:
 *  ☐ check task on: @/types/prisma.d.ts
 *  ☐ [SOON] delete console.dir on function findUniqueLogin
 *
 */

export type QueryTokenArgs = Prisma.TokenWhereUniqueInput;
export type QueryWhitelistedTokenArgs = Prisma.WhitelistedTokenWhereUniqueInput;

class TokenStoreAdapter implements TokenDataSourceAdapter {
    private readonly dataSource: PrismaClient;

    constructor(prisma: PrismaProviderClient) {
        this.dataSource = prisma.getPrismaClient();
    }

    async query(
        query: TokenQueryArgs
    ): Promise<Readonly<Token>[] | Readonly<Token> | null> {
        const results = await this.dataSource.token.findMany({
            where: {
                OR: [
                    { jti: query.jti },
                    { value: query.value },
                    { identityId: query.identityId },
                ],
            },
        });

        return results;
    }

    async update(id: ID, data: Token): Promise<Readonly<Token> | null> {
        const result = await this.dataSource.token.update({
            where: {
                jti: id as string,
            },
            data: {
                value: data.value,
                type: data.type,
                header: data.header as Prisma.JsonObject,
                jti: data.jti,
                payload: data.payload as Prisma.JsonObject,
                kid: data.kid,
                nbf: data.nbf,
                ip_address: data.ip_address,
                device_id: data.device_id,
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
                jti: jti as string,
            },
            data: {
                tokenStatus: TokenStatusTypes.revoked,
            },
        });

        return result ?? null;
    }

    async findUnique(query: QueryTokenArgs): Promise<Readonly<Token> | null> {
        const result = await this.dataSource.token.findUnique({
            where: query,
        });

        return result ?? null;
    }

    async findRelatedTokens({
        device_id,
        ip_address,
    }: TokenRelatedArgs): Promise<Readonly<Token | null>> {
        const results = await this.dataSource.whitelistedToken.findMany({
            include: {
                token: true,
            },
            where: {
                token: {
                    OR: [{ device_id }, { ip_address }],
                    AND: [
                        {
                            tokenStatus: {
                                equals: TokenStatusTypes.active,
                            },
                        },
                    ],
                },
            },
        });

        if (!results || results.length === 0) {
            return null;
        }

        return results[0]?.token ?? null;
    }

    async getWhitelistedTokens(identityId: ID): Promise<Readonly<Token>[] | null> {
        const results = await this.dataSource.whitelistedToken.findMany({
            include: {
                token: true,
            },
            where: {
                identityId: identityId as string,
            },
        });

        const tokens: Readonly<Token>[] | null =
            results.length > 0 ? results.map((result) => result.token as Token) : null;

        return tokens ?? null;
    }

    async findUniqueInWhiteListed(
        query: QueryWhitelistedTokenArgs
    ): Promise<Readonly<Token> | null> {
        const result = await this.dataSource.whitelistedToken.findUnique({
            include: {
                identity: true,
                token: true,
            },
            where: query,
        });

        console.log({ result });

        if (result === null) return null;

        return result.token ?? null;
    }

    async findFirst(query: QueryTokenArgs): Promise<Readonly<Token> | null> {
        const result: Readonly<Token> | null = await this.dataSource.token.findFirst({
            where: query,
        });

        return result ?? null;
    }

    async create<R>(data: Token, identity: R): Promise<Readonly<Token>> {
        const result = await this.dataSource.token.create({
            data: {
                value: data.value,
                type: data.type,
                header: data.header as Prisma.JsonObject,
                jti: data.jti,
                payload: data.payload as Prisma.JsonObject,
                kid: data.kid,
                nbf: data.nbf,
                ip_address: data.ip_address,
                device_id: data.device_id,
                tokenStatus: data.tokenStatus,
                createdAt: new Date(data.createdAt),
                expirationTime: data.expirationTime,
                expires_at: data.expires_at,
                identity: {
                    connect: {
                        id: identity as string,
                    },
                },
                WhitelistedToken: {
                    create: {
                        identity: {
                            connect: {
                                id: data.identityId as string,
                            },
                        },
                    },
                },
            },
        });

        if (!result) throw new Error("Prisma: Token not created!");

        return result;
    }

    async createMany<R>(data: Token[], identity: R): Promise<void> {
        const tokens: Prisma.TokenCreateManyInput[] = data.map((token: Token) => ({
            value: token.value,
            expirationTime: token.expirationTime,
            type: token.type,
            expires_at: token.expires_at,
            header: token.header as Prisma.JsonObject,
            jti: token.jti,
            payload: token.payload as Prisma.JsonObject,
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
            take: 10,
            orderBy: [
                {
                    tokenStatus: "desc",
                },
                {
                    type: "asc",
                },
            ],
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
                    id: identityId as string,
                },
            },
        });

        return result;
    }

    async delete(jti: ID): Promise<void> {
        await this.dataSource.token.delete({
            where: {
                jti: jti as string,
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
