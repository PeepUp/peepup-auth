import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { cookieConfig } from "@/application/config/cookie.config";
import HTTPUtil from "@/common/utils/http.util";
import CryptoUtil from "@/common/libs/crypto";

export function generateUserFingerprint() {
    const randomFingerprint = CryptoUtil.generateRandomString(50);
    return randomFingerprint;
}

export function fingerprintHook(
    request: FastifyRequest,
    reply: FastifyReply,
    done: DoneFuncWithErrOrRes
) {
    const cookies = HTTPUtil.parseCookies(request.headers.cookie as string);

    if (cookies?.[cookieConfig.cookies.fingerprint] || request.fingerprint) {
        return done();
    }

    const fingerprint = generateUserFingerprint();
    console.log({ info: "generate new user fingerprint" });

    reply.cookie(cookieConfig.cookies.fingerprint, fingerprint, {
        domain: "127.0.0.1",
        expires: new Date(Date.now() + 86400000),
        maxAge: Date.now() + 86400000,
        secure: true,
        signed: true,
        httpOnly: true,
        sameSite: "none",
    });

    request.fingerprint = fingerprint;

    return done();
}
