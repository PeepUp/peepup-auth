import type { AccountRepository } from "application/repositories/accounts";
import type { UseCase } from "common/types";
import { AccountEntity } from "domain/entities";

export class GetUsersUseCase implements UseCase {
   private repository: AccountRepository;

   constructor(repository: AccountRepository) {
      this.repository = repository;
   }

   async execute(): Promise<AccountEntity[]> {
      try {
         return await this.repository.getUsers();
      } catch (error: any) {
         throw new Error(error.message);
      }
   }
}
