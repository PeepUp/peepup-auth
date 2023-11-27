import type { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { cookieConfig } from "@/application/config/cookie.config";
import HTTPUtil from "@/common/utils/http.util";
import CryptoUtil from "@/common/libs/crypto";

export function deviceIdHook(
    request: FastifyRequest,
    reply: FastifyReply,
    done: DoneFuncWithErrOrRes
) {
    const cookies = HTTPUtil.parseCookies(request.headers.cookie as string);

    if (cookies?.[cookieConfig.cookies.deviceId] && cookies?.[cookieConfig.cookies.user_session]) {
        return done();
    }

    reply.cookie(cookieConfig.cookies.user_session, CryptoUtil.generateRandomString(16), {
        domain: "127.0.0.1",
        expires: new Date(Date.now() + 86400000),
        signed: true,
        secure: true,
        httpOnly: true,
        sameSite: "none",
    });

    reply.cookie(cookieConfig.cookies.deviceId, CryptoUtil.generateRandomString(12), {
        domain: "127.0.0.1",
        expires: new Date(Date.now() + 86400000),
        signed: true,
        secure: true,
        httpOnly: true,
        sameSite: "none",
        path: "/",
    });

    return done();
}
