import type { Identity } from "@/domain/entity/identity";
import type * as Types from "@/types/types";
import type { PrismaProviderClient } from "@/infrastructure/database/prisma-provider";

import type { PrismaClient } from "@prisma/client";
import { QueryOptions } from "@/adapter/schema/db";

/**
 * @todo:
 *  ☐ check task on: @/types/prisma.d.ts
 *  ☐ [SOON] delete console.dir on function findUniqueLogin
 *
 */

class IdentityStoreAdapter implements Types.DataSourceSQL<Identity> {
    private readonly db: PrismaClient;

    private options = {
        defaultSelect: {
            email: true,
            id: true,
            username: true,
            providerId: true,
            emailVerified: true,
            lastName: true,
            firstName: true,
            avatar: true,
            state: true,
        },
        take: 5,
    };

    constructor(prisma: PrismaProviderClient) {
        this.db = prisma.getPrismaClient();
    }

    async query(query: Identity, options?: QueryOptions): Promise<Identity[]> {
        console.log({ query_identities: query, options });
        const result: Readonly<Identity>[] = (await this.db.identity.findMany({
            where: {
                email: { contains: query.email },
                id: { contains: query.id as string },
                username: { contains: query.username as string },
                password: { contains: query.password as string },
            },
            select: options?.select ?? this.options.defaultSelect,
            take: (options?.take as number) ?? this.options.take,
        })) as Identity[];

        return result;
    }

    async findUnique(
        query: Types.FindUniqeIdentityQuery
    ): Promise<Readonly<Identity> | null> {
        const result: Readonly<Identity> | null = await this.db.identity.findUnique({
            where: {
                email: query.email as string,
                phoneNumber: query.phone_number as string,
            },
        });

        return result;
    }

    async findFirst(
        query: Types.FindUniqeIdentityQuery
    ): Promise<Readonly<Identity> | null> {
        const result: Readonly<Identity> | null = await this.db.identity.findFirst({
            where: {
                OR: [
                    {
                        email: { contains: query.email as string },
                    },
                    {
                        phoneNumber: { contains: query.phone_number as string },
                    },
                ],
            },
        });

        return result;
    }

    async findUniqueLogin(
        query: Types.FindUniqeIdentityQuery
    ): Promise<Readonly<Identity> | null> {
        const result: Readonly<Identity> | null = await this.db.identity.findUnique({
            where: {
                email: query.email as string,
                phoneNumber: query.phone_number as string,
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
                phoneNumber: identity.phoneNumber,
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
