/* eslint-disable class-methods-use-this */

import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";

import type { Identity } from "@prisma/client";

import { Action, RoleType } from "../../common/constant";

export type SubjectsAbility = Subjects<{
    Identity: Identity;
}>;

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

export type AppAbility = PureAbility<[Action, SubjectsAbility], PrismaQuery>;

export class AbilityFactory {
    static defineAbilitiesFor(identity: Identity, role: string) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            createPrismaAbility
        );

        if (role === RoleType.admin) {
            can(Action.manage, "Identity", { id: { equals: identity.id } });
        }

        console.log(cannot, build, can);
        console.log(
            "🚀 ~ file: ability.ts:18 ~ AbilityFactory ~ defineAbilitiesFor ~ isAdmin:",
            role
        );

        return build();
    }
}
