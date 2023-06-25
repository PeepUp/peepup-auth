import Account from "@/domain/entity/account";

import type { AccountContract, UseCase } from "@/types/types";
import type { AccountRepository } from "application/repository/accounts";

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
