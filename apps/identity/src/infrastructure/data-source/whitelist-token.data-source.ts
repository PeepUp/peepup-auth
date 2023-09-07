/* eslint-disable class-methods-use-this */
import type { Prisma, PrismaClient } from "@prisma/client";
import type { ID, Token, WhiteListedTokenDataSourceAdapter } from "@/types/types";
import { TokenStatusType } from "../../common/constant";

/**
 * @todo:
 *  ☐ check task on: @/types/prisma.d.ts
 *  ☐ [SOON] delete console.dir on function findUniqueLogin
 *
 */

export type QueryTokenArgs = Prisma.TokenWhereUniqueInput;
export type QueryWhitelistedTokenArgs = Prisma.WhitelistedTokenWhereUniqueInput;

class WhiteListedTokenStoreAdapter implements WhiteListedTokenDataSourceAdapter {
    constructor(private readonly dataSource: PrismaClient) {}

    async findMany(): Promise<Readonly<Token[]> | null> {
        const data = await this.dataSource.whitelistedToken.findMany({
            include: {
                token: true,
            },
        });

        if (data === null || data.length === 0) {
            return null;
        }

        return data.map((item) => item.token) ?? null;
    }

    async findManyByIdentityId(identityId: ID): Promise<Readonly<Token[]> | null> {
        const result = await this.dataSource.whitelistedToken.findMany({
            include: {
                token: true,
            },
            where: {
                identityId: identityId as string,
                AND: {
                    token: {
                        tokenStatus: {
                            equals: TokenStatusType.active,
                        },
                    },
                },
            },
            take: 10,
        });

        const tokens: Readonly<Token>[] | null =
            result.length > 0
                ? (result.map((result) => result.token as Token) as Token[])
                : null;

        return tokens ?? null;
    }

    async delete(query: QueryWhitelistedTokenArgs): Promise<void> {
        await this.dataSource.whitelistedToken.delete({
            where: query,
        });
    }

    async deleteMany(identityId: ID): Promise<void> {
        await this.dataSource.whitelistedToken.deleteMany({
            where: {
                identityId: identityId as string,
            },
        });
    }

    find(id: ID): Promise<Readonly<Token | Token[]> | null> {
        throw new Error("Method not implemented.");
    }

    findUnique(query: Prisma.TokenWhereUniqueInput): Promise<Readonly<Token> | null> {
        throw new Error("Method not implemented.");
    }

    update(id: ID, data: Token | Token[]): Promise<Readonly<Token | Token[]> | null> {
        throw new Error("Method not implemented.");
    }

    query(
        query: Partial<Token | Token[]>
    ): Promise<Readonly<Token | Token[]> | Readonly<Token | Token[]>[] | null> {
        throw new Error("Method not implemented.");
    }
}

export default WhiteListedTokenStoreAdapter;
