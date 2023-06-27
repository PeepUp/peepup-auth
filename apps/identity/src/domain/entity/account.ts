import type { AccountContract, ID, RoleContract, UserContract } from "@/types/types";

class Account implements AccountContract {
   public roles?: RoleContract[];
   public tokens?: string[];
   public user: UserContract = <UserContract>{};
   public providerId?: ID;
   public readonly createdAt: Date = new Date();
   readonly _id?: ID;

   constructor(props: AccountContract) {
      this.initializeAccount(props);
   }

   private initializeAccount(props: AccountContract): void {
      this.roles = props?.roles;
      this.tokens = props?.tokens;
      this.user = props.user;
      this.providerId = props?.providerId;
   }
   public get id(): ID | undefined {
      return this._id;
   }
}

export default Account;
