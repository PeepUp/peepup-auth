/* eslint-disable class-methods-use-this */

import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";

import type { Identity } from "@prisma/client";

import { Action } from "../../types/types";

export type SubjectsAbility = Subjects<{
    Identity: Identity;
}>;

export type AppAbility = PureAbility<[Action, SubjectsAbility], PrismaQuery>;

export class AbilityFactory {
    defineAbilitiesFor(identity: Identity, isAdmin: boolean) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            createPrismaAbility
        );

        console.log(cannot, build, can);
        console.log(
            "🚀 ~ file: ability.ts:18 ~ AbilityFactory ~ defineAbilitiesFor ~ isAdmin:",
            isAdmin
        );
        console.log(
            "🚀 ~ file: ability.ts:18 ~ AbilityFactory ~ defineAbilitiesFor ~ identity:",
            identity
        );

        return build();
    }
}
