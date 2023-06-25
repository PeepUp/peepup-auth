import Account from "@/domain/entity/account";

import type { UseCase, UserQuery } from "@/types/types";
import type { AccountRepository } from "application/repository/accounts";

export class GetUsersUseCase implements UseCase<UserQuery> {
   constructor(private readonly repository: AccountRepository) {
      this.repository = repository;
   }

   async execute(query?: UserQuery): Promise<Account[]> {
      try {
         return <Account[]>(
            await this.repository.getAllAccount(query as UserQuery)
         );
      } catch (error: unknown) {
         if (error instanceof Error) throw new Error(error.message);
         return <Account[]>[];
      }
   }
}
