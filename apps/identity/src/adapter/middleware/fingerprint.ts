import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { cookieConfig } from "@/application/config/cookie.config";
import HTTPUtil from "@/common/utils/http.util";
import CryptoUtil from "@/common/libs/crypto";
import * as crypto from "crypto";

export function fingerprintHook(
    request: FastifyRequest,
    reply: FastifyReply,
    done: DoneFuncWithErrOrRes
) {
    const cookies = HTTPUtil.parseCookies(request.headers.cookie as string);

    if (cookies?.[cookieConfig.cookies.fingerprint]) {
        return done();
    }

    const fingerprint = generateUserFingerprint();

    console.log({ info: "generate new user fingerprint" });

    const userFingerprintDigest: Buffer = crypto
        .createHash("sha256")
        .update(fingerprint, "utf-8")
        .digest();

    console.log({ fingerprintcookies: fingerprint, userFingerprintDigest });

    reply.cookie(cookieConfig.cookies.fingerprint, fingerprint, {
        domain: "localhost",
        expires: new Date(Date.now() + 86400000),
        maxAge: Date.now() + 86400000,
        secure: true,
        signed: true,
        httpOnly: true,
        sameSite: "none",
    });

    return done();
}

export function generateUserFingerprint() {
    const randomFingerprint = CryptoUtil.generateRandomString(50);
    return randomFingerprint;
}
