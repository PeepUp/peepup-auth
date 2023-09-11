import { ForbiddenError } from "@casl/ability";
import type { FastifyRequest } from "fastify";
import type { RequiredAbility } from "@/types/ability";
import ForbiddenException from "../error/forbidden-exception";

class Authorization {
    static policy(rules: RequiredAbility[]) {
        return async (request: FastifyRequest) => {
            try {
                rules.forEach(({ action, subject }) =>
                    ForbiddenError.from(request.ability).throwUnlessCan(action, subject)
                );
            } catch (error) {
                if (error instanceof ForbiddenError) {
                    throw new ForbiddenException(
                        "Forbidden: You don't have enough permission!"
                    );
                }
            }
        };
    }
}

export default Authorization;
