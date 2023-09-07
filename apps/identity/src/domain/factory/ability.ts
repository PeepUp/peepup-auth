/* eslint-disable class-methods-use-this */

import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";
import type { Identity } from "@prisma/client";
import { Action, RoleType } from "../../common/constant";

export type SubjectsAbility =
    | Subjects<{
          Identity: Identity;
      }>
    | "all";

export type IdentityAbilityArgs = {
    id: string;
    role: string;
};
export const dummy_identity: Identity = {
    phoneNumber: "1234567890",
    username: "john123",
    state: "active",
    emailVerified: new Date(),
    password:
        "$argon2id$v=19$m=65536,t=3,p=4$CUsArk9CbT6eVPTTqyV7Vg$asdklfhjk3l4wjr23iojoiasdjfiodsafjiods75Z2GayCOWUJpd34",
    avatar: "https://www.google.com",
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com",
    role: RoleType.admin,
    createdAt: new Date(),
    updatedAt: new Date(),
    providerId: 0,
    id: "1234567890",
};

export type AppAbility = PureAbility<[string, SubjectsAbility], PrismaQuery>;
let ANONYMOUS_ABILITY: AppAbility;

export class AbilityFactory {
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
                this.defineAdminRules(identity, builder);
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

    defineAdminRules(identity: IdentityAbilityArgs, b: AbilityBuilder<AppAbility>) {
        b.can(Action.manage, "all");
    }

    defineMemberRules(identity: IdentityAbilityArgs, b: AbilityBuilder<AppAbility>) {
        b.can(Action.manage, "Identity", {
            id: {
                equals: identity.id,
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
    }

    defineAnonymousRules({ can }: AbilityBuilder<AppAbility>) {
        can(Action.read, "all");
    }
}
