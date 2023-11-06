/* eslint-disable @typescript-eslint/naming-convention */
import { PrismaClient } from "@prisma/client";
import PasswordUtils from "@/common/utils/password.util";

import type { HashPasswordArgs, VerifyHashPasswordUtils } from "@/types/types";

const prisma = new PrismaClient();

/**
 * @todo
 *  ☐ encapsulte custom method into prisma model
 * @figure
 *  🤔 figure out how to extend prisma model with custom methods, so we can used by modules declared in the domain layer
 *  🤔 idk why readonly in string with method replace*() dont respect readonly
 *
 */
prisma.$extends({
    model: {
        identity: {
            async hashPassword(data: HashPasswordArgs) {
                const { _ } = data;
                const hashed = await PasswordUtils.hash({
                    _,
                    salt: await PasswordUtils.generateSalt(),
                });
                return hashed;
            },

            async verifyPassword(data: VerifyHashPasswordUtils) {
                const { _, __ } = data;
                const verified = await PasswordUtils.verify({
                    _,
                    __,
                });
                return verified;
            },
        },
    },
});

export default prisma;
