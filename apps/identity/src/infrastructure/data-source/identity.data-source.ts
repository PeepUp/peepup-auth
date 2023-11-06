import type { Identity } from "@/domain/entity/identity";
import type * as Types from "@/types/types";
import type { PrismaProviderClient } from "@/infrastructure/database/prisma-provider";

import type { PrismaClient } from "@prisma/client";

/**
 * @todo:
 *  ☐ check task on: @/types/prisma.d.ts
 *  ☐ [SOON] delete console.dir on function findUniqueLogin
 *
 */

class IdentityStoreAdapter implements Types.DataSourceSQL<Identity> {
    private readonly db: PrismaClient;

    constructor(prisma: PrismaProviderClient) {
        this.db = prisma.getPrismaClient();
    }

    async query(query: Identity): Promise<Identity[]> {
        const result: Readonly<Identity>[] = await this.db.identity.findMany({
            where: {
                email: { contains: query.email },
                id: { contains: query.id as string },
                username: { contains: query.username as string },
                password: { contains: query.password as string },
            },
        });

        return result;
    }

    async findUnique(
        query: Types.FindUniqeIdentityQuery
    ): Promise<Readonly<Identity> | null> {
        const result: Readonly<Identity> | null = await this.db.identity.findUnique({
            where: {
                email: query.email,
                username: query.username,
            },
        });

        return result;
    }

    async findFirst(
        query: Types.FindUniqeIdentityQuery
    ): Promise<Readonly<Identity> | null> {
        const result: Readonly<Identity> | null = await this.db.identity.findFirst({
            where: query,
        });

        return result;
    }

    async findUniqueLogin(
        query: Types.FindLoginIdentityQuery
    ): Promise<Readonly<Identity> | null> {
        const result: Readonly<Identity> | null = await this.db.identity.findUnique({
            where: {
                email: query.where.email,
                username: query.where.username,
            },
        });

        if (result === null) return null;

        // const verified = await this.db.identity.verifyPassword({
        //     _: query.data.password,
        //     __: result.password,
        // });

        // console.dir({ verified }, { depth: Infinity });
        // if (!verified) return null;

        return result;
    }

    async create(identity: Identity): Promise<Identity> {
        // const hashedPassword = await this.db.identity.hashPassword({
        //     _: identity.password,
        // });

        const result: Readonly<Identity> = await this.db.identity.create({
            data: {
                email: identity.email,
                username: identity.username,
                password: identity.password,
                firstName: identity.firstName,
                lastName: identity.lastName,
                updatedAt: new Date(),
                createdAt: new Date(),
            },
        });

        return result;
    }

    async findMany(): Promise<Readonly<Identity>[] | null> {
        const result: Readonly<Identity>[] | null = await this.db.identity.findMany();
        return result;
    }

    async find(id: Types.ID): Promise<Readonly<Identity> | null> {
        const result: Readonly<Identity | null> = await this.db.identity.findFirst({
            where: {
                id: <string>id,
            },
        });

        return Object.freeze(result);
    }

    async update(id: Types.ID, data: Identity): Promise<Identity> {
        const result: Readonly<Identity> = await this.db.identity.update({
            where: {
                id: <string>id,
            },
            data: {
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                avatar: data.avatar,
                updatedAt: new Date(),
                state: data.state,
            },
        });

        return result;
    }

    async delete(id: Types.ID): Promise<void> {
        await this.db.identity.delete({
            where: {
                id: <string>id,
            },
        });
    }
}

export default IdentityStoreAdapter;
