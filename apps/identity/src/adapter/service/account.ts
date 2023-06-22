import { AccountRepository } from "@/application/repository/accounts";
import { ID, UserAccount } from "@/common";
import Account from "@/domain/entity/account";

class AccountService {
   constructor(private readonly accountRepository: AccountRepository) {}

   async registerAccount(): Promise<void> {
      throw new Error("Method not implemented.");
   }

   async getAccountById(id: ID): Promise<UserAccount> {
      return await this.accountRepository.getAccountById(id);
   }
}

export default AccountService;
