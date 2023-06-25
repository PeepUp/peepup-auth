import { AccountRepository } from "@/application/repository/accounts";

import type { AccountContract, ID, UseCase } from "@/types/types";

class GetUserById implements UseCase<ID> {
   constructor(private readonly repository: AccountRepository) {}

   async execute(id: ID): Promise<AccountContract> {
      try {
         return <AccountContract>await this.repository.getAccountById(id);
      } catch (error: unknown) {
         if (error instanceof Error) throw new Error(error.message);
         return <AccountContract>{};
      }
   }
}
