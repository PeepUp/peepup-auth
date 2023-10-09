import type { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { httpUtils } from "@/common/utils/utils";
import { cryptoUtils } from "@/common/utils/crypto";
import { cookieConfig } from "@/application/config/cookie.config";

export function deviceIdHook(
    request: FastifyRequest,
    reply: FastifyReply,
    done: DoneFuncWithErrOrRes
) {
    const cookies = httpUtils.parseCookies(request.headers.cookie as string);

    if (
        cookies?.[cookieConfig.cookies.deviceId] &&
        cookies?.[cookieConfig.cookies.user_session]
    ) {
        return done();
    }

    reply.header(
        "set-cookie",
        `${cookieConfig.cookies.deviceId}=${cryptoUtils.generateRandomString(
            12
        )}; Path=/; HttpOnly; SameSite=Strict;`
    );

    reply.header(
        "set-cookie",
        `${cookieConfig.cookies.user_session}=${cryptoUtils.generateRandomString(
            16
        )}; Path=/; HttpOnly; SameSite=Strict;`
    );

    return done();
}
