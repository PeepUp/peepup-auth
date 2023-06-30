import { HashPasswordArgs, VerifyHashPasswordUtils } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { passwordUtils } from "../common";

const prisma = new PrismaClient();

/**
 * @todo
 *  ☐ encapsulte custom method into prisma model
 * @figure
 *  🤔 rather the password
 *  🤔 idk why readonly in string with method replace*() dont respect readonly
 */

prisma.$extends({
    model: {
        identity: {
            async hashPassword(data: HashPasswordArgs) {
                const { _ } = data;
                const hashed = await passwordUtils.hash({
                    _: _,
                    salt: await passwordUtils.generateSalt(),
                });
                return hashed;
            },

            async verifyPassword(data: VerifyHashPasswordUtils) {
                const { _, __ } = data;
                const verified = await passwordUtils.verify({
                    _: _,
                    __: __,
                });
                return verified;
            },
        },
    },
});

export default prisma;
