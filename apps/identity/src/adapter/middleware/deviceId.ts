import type { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { cookieConfig } from "@/application/config/cookie.config";
import HTTPUtil from "@/common/utils/http.util";
import CryptoUtil from "@/common/utils/crypto";

export function deviceIdHook(
    request: FastifyRequest,
    reply: FastifyReply,
    done: DoneFuncWithErrOrRes
) {
    const cookies = HTTPUtil.parseCookies(request.headers.cookie as string);

    if (
        cookies?.[cookieConfig.cookies.deviceId] &&
        cookies?.[cookieConfig.cookies.user_session]
    ) {
        return done();
    }

    reply.header(
        "set-cookie",
        `${cookieConfig.cookies.deviceId}=${CryptoUtil.generateRandomString(
            12
        )}; Path=/; HttpOnly; SameSite=Strict;`
    );

    reply.header(
        "set-cookie",
        `${cookieConfig.cookies.user_session}=${CryptoUtil.generateRandomString(
            16
        )}; Path=/; HttpOnly; SameSite=Strict;`
    );

    return done();
}
