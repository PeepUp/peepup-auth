import Account from "@/domain/entity/account";

import type { AccountRepository } from "application/repository/accounts";
import type { UseCase, UserQuery } from "common/types";

export class GetUsersUseCase implements UseCase<UserQuery> {
   constructor(private readonly repository: AccountRepository) {
      this.repository = repository;
   }

   async execute(query?: UserQuery): Promise<Account[]> {
      try {
         return <Account[]>(
            await this.repository.getAllUsers(query as UserQuery)
         );
      } catch (error: unknown) {
         if (error instanceof Error) throw new Error(error.message);
         return <Account[]>[];
      }
   }
}
