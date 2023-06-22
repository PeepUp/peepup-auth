import { AccountRepository } from "@/application/repository/accounts";

import type { ID, UseCase, UserAccount } from "@/common";

class GetUserById implements UseCase<ID> {
   constructor(private readonly repository: AccountRepository) {}

   async execute(id: ID): Promise<UserAccount> {
      try {
         return <UserAccount>await this.repository.getUserById(id);
      } catch (error: unknown) {
         if (error instanceof Error) throw new Error(error.message);
         return <UserAccount>{};
      }
   }
}
