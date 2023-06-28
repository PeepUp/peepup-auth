import type { DataSourceSQLExtended, ID, Token } from "@/types/types";
import { Prisma, PrismaClient } from "@prisma/client";

/**
 * @todo:
 *  ☐ check task on: @/types/prisma.d.ts
 *  ☐ [SOON] delete console.dir on function findUniqueLogin
 *
 */

export type QueryTokenArgs = Prisma.TokenWhereUniqueInput;

class TokenStoreAdapter implements DataSourceSQLExtended<Token> {
    constructor(private readonly db: PrismaClient) {}

    async query(query: QueryTokenArgs): Promise<Token[]> {
        const result: Readonly<Token>[] = await this.db.token.findMany({
            where: query,
        });

        return result;
    }

    async findUnique(query: QueryTokenArgs): Promise<Readonly<Token> | null> {
        const result: Readonly<Token> | null = await this.db.token.findUnique({
            where: query,
        });

        return result;
    }

    async findFirst(query: QueryTokenArgs): Promise<Readonly<Token> | null> {
        const result: Readonly<Token> | null = await this.db.token.findFirst({
            where: query,
        });

        return result;
    }

    async create<R>(token: Token, identity: R): Promise<Token> {
        const result: Readonly<Token> = await this.db.token.create({
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

    async findMany(): Promise<Readonly<Token>[] | null> {
        const result: Readonly<Token>[] | null = await this.db.token.findMany();
        return result;
    }

    async find(id: ID): Promise<Readonly<Token> | null> {
        const result: Readonly<Token> | null = await this.db.token.findFirst({
            where: {
                id: <number>id,
            },
        });

        return Object.freeze(result);
    }

    async update(id: ID, token: Token): Promise<Token> {
        const result: Readonly<Token> = await this.db.token.update({
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
        await this.db.token.delete({
            where: {
                id: <number>id,
            },
        });
    }
}

export default TokenStoreAdapter;
