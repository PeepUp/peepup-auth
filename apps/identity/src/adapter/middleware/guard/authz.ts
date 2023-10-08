import type { FastifyRequest } from "fastify";
import { ForbiddenError } from "@casl/ability";
import type { RequiredAbility } from "@/types/ability";

import ForbiddenException from "@/adapter/middleware/error/forbidden-exception";

class Authorization {
    static policy(rules: RequiredAbility[]) {
        return async (request: FastifyRequest) => {
            try {
                console.log({ ability: request.ability });
                rules.forEach(({ action, subject }) =>
                    ForbiddenError.from(request.ability).throwUnlessCan(action, subject)
                );
            } catch (error) {
                if (error instanceof ForbiddenError) {
                    throw new ForbiddenException(
                        "Sorry! looks like You don't have permission or access to the resource!"
                    );
                }
            }
        };
    }
}

export default Authorization;
