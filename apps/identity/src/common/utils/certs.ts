/* eslint-disable class-methods-use-this */
import { generateKeyPairSync } from "crypto";
import { writeFileSync } from "fs";
import { join } from "path";

import type { KeyPair } from "@/types/token";

export default class Certificate {
    constructor(
        public path: string,
        private privateKey?: string | null,
        private publicKey?: string | null
    ) {}

    public generateKeyPairRSA(length = 4096): KeyPair {
        const { privateKey, publicKey } = generateKeyPairSync("rsa", {
            modulusLength: length,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            },
        });

        return { privateKey, publicKey };
    }

    public getPrivateKey(): Readonly<string> {
        return this.privateKey ?? "";
    }

    public setPrivateKey(privateKey: string): void {
        this.privateKey = privateKey;
    }

    public setPublicKey(publicKey: string): void {
        this.publicKey = publicKey;
    }

    public getPublicKey(): Readonly<string> {
        return this.publicKey ?? "";
    }

    public generateKeyPairECDSA(namedCurve = "prime256v1"): KeyPair {
        const { privateKey, publicKey } = generateKeyPairSync("ec", {
            namedCurve,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            },
        });

        this.privateKey = privateKey;
        this.publicKey = publicKey;

        return { privateKey, publicKey };
    }

    public saveKeyPair(keys: KeyPair, path: string): void {
        const { privateKey, publicKey } = keys;
        const privateKeyPath = join(path, "private.pem.key");
        const publicKeyPath = join(path, "public.pem.key");

        try {
            writeFileSync(privateKeyPath, privateKey, "utf-8");
            writeFileSync(publicKeyPath, publicKey, "utf-8");
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
        }
    }
}
