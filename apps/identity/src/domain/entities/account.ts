import { Account, Permission, Provider, Role, User } from "@prisma/client";
import { Entity } from "domain/base/entity";

export class AccountEntity extends Entity<Account> {
   private constructor({ props }: { props: Account }) {
      super(props);
   }

   public equals(props: Entity<Account>): boolean {
      return props.equals(props);
   }
}
