import Account from "@/domain/entity/account";

import type { AccountRepository } from "application/repository/accounts";
import type { AccountContract, UseCase } from "common/types";

export class RegisterUser implements UseCase<AccountContract> {
   constructor(private readonly repository: AccountRepository) {
      this.repository = repository;
   }

   async execute(data: AccountContract): Promise<Account> {
      try {
         throw new Error("Not implemented");
      } catch (error: unknown) {
         if (error instanceof Error) throw new Error(error.message);
         return <Account>{};
      }
   }
}
