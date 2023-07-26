import type { RequestHandler } from "@/types/types";
import type { LoginIdentityBody, RegisterIdentityBody } from "@/adapter/schema/auth";
import type AuthenticationService from "@/adapter/service/authentication";
import { POST_LOGIN_IDENTITY_BODY_SCHEMA } from "../schema/auth";

/**
 * @todo:
 *  ☐ clean up this mess (code smells & clean code)
 *
 */
class AuthLocalStrategyHandler {
    constructor(private readonly authService: AuthenticationService) {}

    login: RequestHandler<unknown, unknown, LoginIdentityBody> = async (
        request,
        reply
    ) => {
        const { traits, password, password_identifier, method } = request.body;
        const parsedBody = POST_LOGIN_IDENTITY_BODY_SCHEMA.safeParse(request.body);

        if (!parsedBody.success) {
            return reply.status(400).send({
                status: "failed",
                code: 400,
                codeStatus: "Bad Request",
                message: "bad request",
            });
        }

        const result = await this.authService.login({
            traits,
            password_identifier,
            method,
            password,
        });

        if (!result) {
            return reply.status(401).send({
                status: "failed",
                code: 401,
                codeStatus: "Unauthorized",
                message:
                    "failed logged in identity, check username, email or password are incorrect",
            });
        }

        return reply.status(200).send({
            access_token: result.access_token,
            refresh_token: result.refresh_token,
        });
    };

    registration: RequestHandler<unknown, unknown, RegisterIdentityBody> = async (
        request,
        reply
    ) => {
        const { traits, password, method } = request.body;

        await this.authService.registration({
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
}

export default AuthLocalStrategyHandler;
