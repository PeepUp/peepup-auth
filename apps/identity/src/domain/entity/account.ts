import type { ID, UserAccount, UserProfile, UserRole } from "common/types";

class Account implements UserAccount {
   public roles: UserRole[] = [];
   public tokens: string[] = [];
   public profile: UserProfile = (<UserProfile>{}) as UserProfile;
   public providerId: number = 0;
   public readonly createdAt: Date = new Date();
   readonly _id?: ID | undefined;

   constructor(props: UserAccount) {
      this.initializeAccount(props);
   }

   private initializeAccount(props: UserAccount): void {
      this.roles = props.roles;
      this.tokens = props.tokens;
      this.profile = props.profile;
      this.providerId = props.providerId;
   }

   public get id(): ID | undefined {
      return this._id ? <ID>this._id : undefined;
   }
}

export default Account;
