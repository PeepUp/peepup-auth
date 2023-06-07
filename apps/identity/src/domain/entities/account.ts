import {
   AccountProps,
   Entity,
   ID,
   Permission,
   Role,
   UserProps,
} from "common/types";

import type { Account as AccountSchema, User } from "@prisma/client";

export type AccountEntityTypes = Entity & AccountProps;

export class AccountEntity implements AccountEntityTypes {
   constructor(
      public roles: Role[] = [],
      public permissions: Permission[] = [],
      public tokens: string[] = [],
      public profile: UserProps = <UserProps>{},
      public providerId: number = 0,
      public createdAt: Date = new Date()
   ) {}

   set id(id: ID) {
      this.id = id;
   }
}
