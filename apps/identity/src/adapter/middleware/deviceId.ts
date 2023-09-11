import type { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { httpUtils } from "../../common/utils/utils";
import { cookieConfig } from "../../application/config/cookie.config";
import { cryptoUtils } from "../../common/utils/crypto";

export function deviceIdHook(
    request: FastifyRequest,
    reply: FastifyReply,
    done: DoneFuncWithErrOrRes
) {
    const cookies = httpUtils.parseCookies(request.headers.cookie as string);

    if (!cookies) {
        console.log("cookies not found!");
        reply.header(
            "set-cookie",
            `${cookieConfig.cookies.deviceId}=${cryptoUtils.hashString(
                cryptoUtils.generateRandomSHA256(32)
            )}; Path=/; HttpOnly; SameSite=Strict;`
        );

        reply.header(
            "set-cookie",
            `${cookieConfig.cookies.user_session}=${cryptoUtils.hashString(
                cryptoUtils.generateRandomSHA256(64)
            )}; Path=/; HttpOnly; SameSite=Strict;`
        );

        return done();
    }

    return done();
}
