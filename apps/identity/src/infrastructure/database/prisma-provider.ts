import { PrismaClient } from "@prisma/client";
import PasswordUtil from "@/common/utils/password.util";

import type { HashPasswordArgs, VerifyHashPasswordUtils } from "@/types/types";

export type PrismaProviderClient = PrismaProvider;

class PrismaProvider extends PrismaClient {
    private static db: PrismaProvider;

    private readonly prisma: PrismaClient;

    private constructor() {
        super();
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

    public connect(): void {
        this.prisma.$connect();
    }

    public disconnect(): void {
        this.prisma.$disconnect();
    }

    public async initializeExtends(): Promise<void> {
        if (this.prisma) {
            this.prisma.$extends({
                model: {
                    identity: {
                        async hashPassword(data: HashPasswordArgs) {
                            return PasswordUtil.hash({
                                _: data._,
                                salt: await PasswordUtil.generateSalt(),
                            });
                        },

                        async verifyPassword(data: VerifyHashPasswordUtils) {
                            const { _, __ } = data;
                            const verified = await PasswordUtil.verify({ _, __ });
                            return verified;
                        },
                    },
                },
            });
        }
    }
}

export default PrismaProvider;
