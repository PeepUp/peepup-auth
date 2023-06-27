import { AccountRepository } from "@/application/repository/accounts";

class AccountService {
   constructor(private readonly accountRepository: AccountRepository) {}
}

export default AccountService;
