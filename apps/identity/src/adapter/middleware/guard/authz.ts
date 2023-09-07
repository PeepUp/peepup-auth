import { Action } from "@/common/constant";
import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { ForbiddenError } from "@casl/ability";
import { SubjectsAbility } from "@/domain/factory/ability";
import ForbiddenException from "../error/forbidden-exception";

export type RequiredAbility = { action: Action; subject: SubjectsAbility };

class AuthZ {
    static authorize(rules: RequiredAbility[]) {
        return async (
            request: FastifyRequest,
            reply: FastifyReply,
            done: DoneFuncWithErrOrRes
        ) => {
            try {
                console.log({
                    rules,
                });

                const ability = request.ability;

                rules.forEach(({ action, subject }) =>
                    ForbiddenError.from(ability).throwUnlessCan(action, subject)
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

export default AuthZ;
