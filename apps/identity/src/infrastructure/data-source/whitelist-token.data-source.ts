/* eslint-disable class-methods-use-this */
import { TokenStatusType } from "@/common/constant";

import type { Prisma, PrismaClient } from "@prisma/client";
import type { ID, Token, WhiteListedTokenDataSourceAdapter } from "@/types/types";
import type { PrismaProviderClient } from "../database/prisma-provider";

/**
 * @todo:
 *  ☐ check task on: @/types/prisma.d.ts
 *  ☐ [SOON] delete console.dir on function findUniqueLogin
 *
 */

export type QueryTokenArgs = Prisma.TokenWhereUniqueInput;
export type QueryWhitelistedTokenArgs = Prisma.WhitelistedTokenWhereUniqueInput;

class WhiteListedTokenStoreAdapter implements WhiteListedTokenDataSourceAdapter {
    private readonly dataSource: PrismaClient;

    constructor(prisma: PrismaProviderClient) {
        this.dataSource = prisma.getPrismaClient();
    }

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
            result.length > 0 ? (result.map((item) => item.token as Token) as Token[]) : null;

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
}

export default WhiteListedTokenStoreAdapter;
