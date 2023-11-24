import crypto from "crypto";
import config from "@/application/config/api.config";
import type { BinaryToTextEncoding } from "crypto";

export default class CryptoUtil {
    private static encConfig = config.environment.encryption;

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

    public static encryptData(data: { value: Readonly<string> }): Readonly<string> {
        const { algorithm, secret_key, secret_iv } = this.encConfig;
        const cipher = crypto.createCipheriv(
            algorithm,
            Buffer.from(secret_key, "base64"),
            Buffer.from(secret_iv, "base64")
        );
        return Buffer.from(
            cipher.update(data.value, "utf8", "hex") + cipher.final("hex")
        ).toString("base64");
    }

    public static decryptData(data: { value: Readonly<string> }): Readonly<string> {
        const buffer = Buffer.from(data.value, "base64").toString("utf-8");
        const { algorithm, secret_key, secret_iv } = this.encConfig;
        const decipher = crypto.createDecipheriv(
            algorithm,
            Buffer.from(secret_key, "base64"),
            Buffer.from(secret_iv, "base64")
        );
        return Buffer.from(
            decipher.update(buffer, "hex", "utf8") + decipher.final("utf8")
        ).toString("utf-8");
    }
}
