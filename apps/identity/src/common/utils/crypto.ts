import crypto from "crypto";

function generateRandomSHA256(len: number): string {
    const randomData = crypto.randomBytes(len ?? 32);
    const hash = crypto.createHash("sha256").update(randomData).digest("hex");

    return hash;
}

function generateCUID(): string {
    const timestamp = Date.now().toString(36).padStart(10, "0");
    const randomPart = Math.random().toString(36).slice(2, 8).padEnd(6, "0");

    return `${timestamp}${randomPart}`;
}

function generateRandomString(length: number = 32) {
    if (length <= 0) {
        throw new Error("Length must be greater than 0");
    }

    const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
    return randomBytes.toString("hex").slice(0, length);
}

function hashString(value: string) {
    const sha256 = crypto.createHash("sha256");
    return sha256.update(value).digest("hex");
}

export const cryptoUtils = {
    generateRandomSHA256,
    generateCUID,
    hashString,
    generateRandomString,
};
