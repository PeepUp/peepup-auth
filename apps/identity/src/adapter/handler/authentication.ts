import type { FastifyRequest } from "fastify";
import type { RequestHandler, unknown as _ } from "@/types/types";
import type AuthenticationService from "@/adapter/service/authentication";

import * as schema from "@/adapter/schema/auth";
import * as config from "@/application/config/cookie.config";
import HTTPUtil from "@/common/utils/http.util";

export default class AuthLocalStrategyHandler {
    private DEVICE_ID_COOKIES_NAME: string = config.cookieConfig.cookies.deviceId;

    constructor(private readonly authenticationService: AuthenticationService) {}

    login: RequestHandler<_, _, schema.LoginIdentityBody> = async (request, reply) => {
        const { body } = request;
        const ip_address = HTTPUtil.getIpAddress(Object.freeze<FastifyRequest>(request));
        const parsedBody = schema.POST_LOGIN_IDENTITY_BODY_SCHEMA.safeParse(body);
        const fgp = request.cookies?.[config.cookieConfig.cookies.fingerprint] ?? "";
        const device_id = request.cookies?.[this.DEVICE_ID_COOKIES_NAME] ?? "";

        if ("success" in parsedBody === false) {
            return reply.status(400).send({
                status: "failed",
                code: 400,
                codeStatus: "Bad Request",
                message: "bad request",
            });
        }

        const result = await this.authenticationService.login({
            fgp,
            body,
            device_id,
            ip_address,
        });

        if (!result) {
            return reply.status(401).send({
                status: "failed",
                code: 401,
                codeStatus: "Unauthorized",
                message: "Please cross check again! username, email or password are incorrect!",
            });
        }

        return reply.status(200).send(result);
    };

    emailAddressChecker: RequestHandler<
        _,
        _,
        {
            email: string;
        }
    > = async (request, reply) => {
        const { email } = request.body;
        const result = await this.authenticationService.checkEmailExist(email);

        if (!result) {
            return reply.status(204).send();
        }

        return reply.status(409).send();
    };

    registration: RequestHandler<_, _, schema.RegisterIdentityBody> = async (request, reply) => {
        const { body } = request;
        await this.authenticationService.registration(body);
        return reply.status(201).send({
            status: "ok",
            code: 201,
            codeStatus: "created",
            message: "successfull creating identity",
        });
    };

    logout: RequestHandler<_> = async (request, reply) => {
        await this.authenticationService.logout(request.headers.authorization as string);
        return reply.status(204).send({});
    };
}
