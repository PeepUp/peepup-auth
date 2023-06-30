import type { RequestHandler } from "@/types/types";
import type { LoginIdentityBody, RegisterIdentityBody } from "../schema/auth.schema";
import type AuthenticationService from "../service/authentication";

/**
 * @todo:
 *  ☐ clean up this mess (code smells & clean code)
 *
 */
class AuthLocalStrategyHandler {
    constructor(private readonly authService: AuthenticationService) {}

    login: RequestHandler<{ Body: LoginIdentityBody }> = async (request, reply) => {
        const { traits, password, password_identifier, method } = <LoginIdentityBody>(
            request.body
        );

        const result = await this.authService.login({
            traits,
            password_identifier,
            method,
            password,
        });

        if (!result) {
            setImmediate(() => {
                reply.status(401).send({
                    status: "failed",
                    code: 401,
                    codeStatus: "Unauthorized",
                    message:
                        "failed logged in identity, check username, email or password are incorrect",
                });
            });
        }

        setImmediate(() => {
            reply.status(200).send({
                access_token: result?.access.value,
                refresh_token: result?.access.value,
            });
        });

        return reply;
    };

    registration: RequestHandler<RegisterIdentityBody> = async (request, reply) => {
        const { traits, password, method } = <RegisterIdentityBody>request.body;

        await this.authService.registration({
            password,
            traits,
            method,
        });

        setImmediate(() => {
            reply.status(201).send({
                status: "ok",
                code: 201,
                codeStatus: "created",
                message: "successfull creating identity",
            });
        });

        return reply;
    };
}

export default AuthLocalStrategyHandler;
