/* eslint-disable import/prefer-default-export */
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

export const cryptoUtils = {
    generateRandomSHA256,
    generateCUID,
};
