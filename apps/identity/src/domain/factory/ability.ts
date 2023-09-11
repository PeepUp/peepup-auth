/* eslint-disable class-methods-use-this */

import { AbilityBuilder } from "@casl/ability";
import { createPrismaAbility } from "@casl/prisma";
import { Action } from "@/common/constant";

import type { AppAbility } from "@/types/ability";
import type { IdentityAbilityArgs } from "@/types/types";

let ANONYMOUS_ABILITY: AppAbility;

class AbilityFactory {
    defineAbilityFor(identity: IdentityAbilityArgs) {
        if (identity) return createPrismaAbility(this.defineRulesFor(identity));

        ANONYMOUS_ABILITY =
            ANONYMOUS_ABILITY || createPrismaAbility(this.defineRulesFor());
        return ANONYMOUS_ABILITY;
    }

    defineRulesFor(identity?: IdentityAbilityArgs) {
        const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

        switch (identity?.role) {
            case "admin":
                this.defineAdminRules(builder);
                break;
            case "member":
                this.defineMemberRules(identity, builder);
                break;
            case "organization":
                this.defineMemberRules(identity, builder);
                break;
            default:
                this.defineAnonymousRules(builder);
                break;
        }

        return builder.rules;
    }

    defineAdminRules(b: AbilityBuilder<AppAbility>) {
        b.can(Action.manage, "all");
        b.can(Action.readAll, "Identity");
    }

    defineMemberRules(identity: IdentityAbilityArgs, b: AbilityBuilder<AppAbility>) {
        b.can(Action.manage, "Identity", {
            id: {
                equals: identity.id,
            },
        });
        b.cannot(Action.readAll, "Identity");
        b.can(Action.manage, "Token", {
            identity: {
                id: {
                    equals: identity.id,
                },
            },
        });
    }

    defineOrganizationRules(
        identity: IdentityAbilityArgs,
        b: AbilityBuilder<AppAbility>
    ) {
        b.can(Action.manage, "Identity", {
            id: {
                equals: identity.id,
            },
        });
        b.can(Action.manage, "Token", {
            identity: {
                id: {
                    equals: identity.id,
                },
            },
        });
    }

    defineAnonymousRules(builder: AbilityBuilder<AppAbility>) {
        return builder;
    }
}

export default AbilityFactory;
