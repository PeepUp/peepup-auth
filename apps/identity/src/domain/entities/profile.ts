import { Entity } from "common/types";

import type { UserProps } from "common/types";

export type UserEntityTypes = Entity & UserProps;

export class UserProfile implements UserEntityTypes {
   id?: number;

   constructor(
      public name: string,
      public username: string,
      public email: string,
      public emailVerified: Date,
      public password: string,
      public phone: string,
      public image: string
   ) {}
}
