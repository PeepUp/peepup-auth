import type { Identity } from "@/domain/entity/identity";
import type { PrismaQuery, Subjects } from "@casl/prisma";
import type { Token } from "@/types";

import { PureAbility } from "@casl/ability";
import { action } from "@/common/constant";

export type RequiredAbility = { action: action; subject: SubjectsAbility };
export type SubjectsAbility =
    | Subjects<{
          Token: Token;
          Identity: Identity;
      }>
    | "all";

export type AppAbility = PureAbility<[string, SubjectsAbility], PrismaQuery>;
