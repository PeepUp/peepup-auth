import Account from "@/domain/entity/account";

import type { AccountRepository } from "application/repository/accounts";
import type { UseCase, UserAccount } from "common/types";

export class GetUsersUseCase implements UseCase<UserAccount> {
   constructor(private readonly repository: AccountRepository) {
      this.repository = repository;
   }

   async execute(user: UserAccount): Promise<Account> {
      try {
         return <Account>await this.repository.getAccount(user);
      } catch (error: unknown) {
         if (error instanceof Error) throw new Error(error.message);
         return <Account>{};
      }
   }
}
