import crypto from "crypto";
import config from "@/application/config/api.config";

import type { BinaryToTextEncoding } from "crypto";

export default class CryptoUtil {
    private static DEFAULT_PAD = "0";

    private static DEFAULT_RADIX = 36;

    private static DEFAULT_RANDOM_LENGTH = 32;

    private static DEFAULT_HASH_ALGORITHM = "sha256";

    private static encConfig = config.environment.encryption;

    private static DEFAULT_DIGEST_TO: BinaryToTextEncoding = "hex";

    private static readonly DEFAULT_ALPHANUMERIC_CHARS =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static LENGTH_OF_ALPHANUMERIC_CHARS = Buffer.byteLength(
        this.DEFAULT_ALPHANUMERIC_CHARS
    );

    public static generateRandomBytesString(len: number): string {
        let result = "";
        for (let i = 0; i < len; i += 1) {
            result += this.DEFAULT_ALPHANUMERIC_CHARS.charAt(
                Math.floor(Math.random() * this.DEFAULT_ALPHANUMERIC_CHARS.length)
            );
        }
        return result;
    }

    public static createSalt(length: number = this.DEFAULT_RANDOM_LENGTH): string {
        let salt = "";

        for (let i = 0; i < length; i += 1) {
            salt += this.DEFAULT_ALPHANUMERIC_CHARS.charAt(
                Math.floor(Math.random() * this.LENGTH_OF_ALPHANUMERIC_CHARS)
            );
        }

        return salt;
    }

    public static safeBase64Buffer(buffer: Buffer): string {
        return buffer
            .toString()
            .replace(/\+/g, "")
            .replace(/-/g, "")
            .replace(/=/g, "")
            .replace(/\//g, "");
    }

    public static generateRandomSHA512(secure: string) {
        return crypto.createHash("sha512").update(secure, "ascii").digest("base64");
    }

    public static generateRandomSHA256(length: number = this.DEFAULT_RANDOM_LENGTH): string {
        const randomData = crypto.randomBytes(length);
        const hash = crypto
            .createHash(this.DEFAULT_HASH_ALGORITHM)
            .update(randomData)
            .digest(this.DEFAULT_DIGEST_TO);

        return hash;
    }

    public static generateCUID(): string {
        const timestamp = Date.now().toString(this.DEFAULT_RADIX).padStart(10, this.DEFAULT_PAD);
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
        return Buffer.from(cipher.update(data.value, "utf8", "hex") + cipher.final("hex")).toString(
            "base64"
        );
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
