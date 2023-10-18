import { PrismaClient } from "@prisma/client";
import * as utils from "@/common/utils/utils";

import type { HashPasswordArgs, VerifyHashPasswordUtils } from "@/types/types";

export type PrismaProviderClient = PrismaProvider;

class PrismaProvider {
    private static db: PrismaProvider;

    private readonly prisma: PrismaClient;

    private constructor() {
        this.prisma = new PrismaClient();
        this.initializeExtends();
        console.log({
            message: "PrismaProvider instance created!",
        });
    }

    public static getInstance(): PrismaProvider {
        if (!PrismaProvider.db) PrismaProvider.db = new PrismaProvider();
        return PrismaProvider.db;
    }

    public getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    public async connect(): Promise<void> {
        await this.prisma.$connect();
    }

    public async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }

    public async initializeExtends(): Promise<void> {
        if (this.prisma) {
            this.prisma.$extends({
                model: {
                    identity: {
                        async hashPassword(data: HashPasswordArgs) {
                            return utils.passwordUtils.hash({
                                _: data._,
                                salt: await utils.passwordUtils.generateSalt(),
                            });
                        },

                        async verifyPassword(data: VerifyHashPasswordUtils) {
                            const { _, __ } = data;
                            const verified = await utils.passwordUtils.verify({ _, __ });
                            return verified;
                        },
                    },
                },
            });
        }
    }
}

export default PrismaProvider;
