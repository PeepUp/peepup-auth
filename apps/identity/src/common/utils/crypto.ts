import crypto from "crypto";

import type { BinaryToTextEncoding } from "crypto";

export default class CryptoUtil {
    private static DEFAULT_DIGEST_TO: BinaryToTextEncoding = "hex";

    private static DEFAULT_RANDOM_LENGTH = 32;

    private static DEFAULT_HASH_ALGORITHM = "sha256";

    private static DEFAULT_RADIX = 36;

    private static DEFAULT_PAD = "0";

    public static generateRandomSHA256(len: number): string {
        const randomData = crypto.randomBytes(len ?? this.DEFAULT_RANDOM_LENGTH);
        const hash = crypto
            .createHash(this.DEFAULT_HASH_ALGORITHM)
            .update(randomData)
            .digest(this.DEFAULT_DIGEST_TO);

        return hash;
    }

    public static generateCUID(): string {
        const timestamp = Date.now()
            .toString(this.DEFAULT_RADIX)
            .padStart(10, this.DEFAULT_PAD);
        const randomPart = Math.random()
            .toString(this.DEFAULT_RADIX)
            .slice(2, 8)
            .padEnd(6, this.DEFAULT_PAD);
        return `${timestamp}${randomPart}`;
    }

    public static generateRandomString(length: number = this.DEFAULT_RANDOM_LENGTH) {
        if (length <= 0) throw new Error("Length must be greater than 0");
        const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
        return randomBytes.toString(this.DEFAULT_DIGEST_TO).slice(0, length);
    }

    public static hashString(value: string) {
        const sha256 = crypto.createHash(this.DEFAULT_HASH_ALGORITHM);
        return sha256.update(value).digest(this.DEFAULT_DIGEST_TO);
    }
}
