import type { ID, UserProfile } from "common/types";

export class User implements UserProfile {
   readonly _id?: ID | undefined;

   constructor(
      public name: string,
      public username: string,
      public email: string,
      public emailVerified: Date,
      public password: string,
      public phone: string,
      public avatar: string
   ) {}

   get id(): ID | undefined {
      return this._id ? this._id : undefined;
   }
}
