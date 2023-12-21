import type { Identity } from "@/domain/entity/identity";
import type { PrismaQuery, Subjects } from "@casl/prisma";

import { PureAbility } from "@casl/ability";
import { action } from "@/common/constant";
import type { Token } from "@/types";

export type RequiredAbility = { action: action; subject: SubjectsAbility };
export type SubjectsAbility =
    | Subjects<{
          Token: Token;
          Identity: Identity;
      }>
    | "all";

export type AppAbility = PureAbility<[string, SubjectsAbility], PrismaQuery>;
