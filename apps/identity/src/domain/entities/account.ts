import { Account, Permission, Provider, Role, User } from "@prisma/client";
import { Entity } from "domain/base/entity";

export class AccountEntity extends Entity<Partial<Account>> {
   private constructor({
      id,
      props,
   }: {
      id: Readonly<number>;
      props: Account;
   }) {
      super(props, id);
   }

   public createUserProfile(data: User): void {
      this.props.profile = data;
   }

   public setUserProvider(data: Provider): void {
      this.props.provider = data;
   }

   public equals(props: Entity<Account>): boolean {
      return props.equals(props);
   }
}
