import { AccountRepository } from "@/application/repository/accounts";
import Account from "@/domain/entity/account";

import type { UseCase } from "@/common";

class GetUserByEmail implements UseCase<string> {
   constructor(private readonly repository: AccountRepository) {}

   async execute(email: string): Promise<Account> {
      try {
         return <Account>await this.repository.getAccountByEmail(email);
      } catch (error: unknown) {
         if (error instanceof Error) throw new Error(error.message);
         return <Account>{};
      }
   }
}
