import { AccountProps, Entity, ID, UserProps, UserRole } from "common/types";
export type AccountEntityTypes = Entity & AccountProps;

export class Account implements Entity {
   public roles: UserRole[] = [];
   public tokens: string[] = [];
   public profile: UserProps = (<UserProps>{}) as UserProps;
   public providerId: number = 0;
   public createdAt: Date = new Date();

   constructor(props: AccountProps) {
      this.initializeAccount(props);
   }

   private initializeAccount(props: AccountProps): void {
      this.roles = props.roles;
      this.tokens = props.tokens;
      this.profile = props.profile;
      this.providerId = props.providerId;
   }

   set id(id: ID) {
      this.id = id;
   }

   get id(): ID {
      return this.id;
   }
}
