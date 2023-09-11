import type { RequestHandler } from "@/types/types";
import type { LoginIdentityBody, RegisterIdentityBody } from "@/adapter/schema/auth";
import type AuthenticationService from "@/adapter/service/authentication";

import * as schema from "@/adapter/schema/auth";
import * as utils from "@/common/utils/utils";
import { cookieConfig } from "@/application/config/cookie.config";

/**
 * @todo:
 *  ☐ clean up this mess (code smells & clean code)
 *
 */
class AuthLocalStrategyHandler {
    constructor(private readonly authenticationService: AuthenticationService) {}

    login: RequestHandler<unknown, unknown, LoginIdentityBody> = async (
        request,
        reply
    ) => {
        const { body } = request;
        const ip_address = utils.httpUtils.getIpAddress(Object.freeze(request));
        const cookies = utils.httpUtils.parseCookies(request.headers.cookie as string);
        const parsedBody = schema.POST_LOGIN_IDENTITY_BODY_SCHEMA.safeParse(body);

        if ("success" in parsedBody === false) {
            return reply.status(400).send({
                status: "failed",
                code: 400,
                codeStatus: "Bad Request",
                message: "bad request",
            });
        }

        const result = await this.authenticationService.login(
            body,
            ip_address,
            cookies![cookieConfig.cookies.deviceId] as string
        );

        if (!result) {
            return reply.status(401).send({
                status: "failed",
                code: 401,
                codeStatus: "Unauthorized",
                message:
                    "Please cross check again! username, email or password are incorrect!",
            });
        }

        return reply.status(200).send(result);
    };

    registration: RequestHandler<unknown, unknown, RegisterIdentityBody> = async (
        request,
        reply
    ) => {
        const { traits, password, method } = request.body;

        await this.authenticationService.registration({
            password,
            traits,
            method,
        });

        return reply.status(201).send({
            status: "ok",
            code: 201,
            codeStatus: "created",
            message: "successfull creating identity",
        });
    };

    logout: RequestHandler<unknown> = async (request, reply) => {
        await this.authenticationService.logout(request.headers.authorization as string);
        return reply.status(204).send();
    };
}

export default AuthLocalStrategyHandler;
