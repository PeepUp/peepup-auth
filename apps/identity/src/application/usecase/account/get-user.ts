import Account from "@/domain/entity/account";

import type { AccountRepository } from "application/repository/accounts";
import type { AccountContract, UseCase } from "@/types/types";

export class GetUsersUseCase implements UseCase<AccountContract> {
   constructor(private readonly repository: AccountRepository) {
      this.repository = repository;
   }

   async execute(user: AccountContract): Promise<Account> {
      try {
         return <Account>await this.repository.getAccount(user);
      } catch (error: unknown) {
         if (error instanceof Error) throw new Error(error.message);
         return <Account>{};
      }
   }
}
