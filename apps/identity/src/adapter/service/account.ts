import { AccountRepository } from "@/application/repository/accounts";
import { ID, UserAccount, passwordUtils } from "../../common";
import Account from "../../domain/entity/account";
import { CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE } from "../schema/account.schema";

class AccountService {
   constructor(private readonly accountRepository: AccountRepository) {}

   async registerAccount({
      name,
      email,
      password,
   }: CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE): Promise<void> {
      const hashedPassword = await passwordUtils.hash({
         password,
         salt: await passwordUtils.generateSalt(16),
      });

      const profile = {
         name,
         email,
         password: hashedPassword,
      };

      const account = new Account({
         profile,
      });

      await this.accountRepository.createAccount({
         profile: {
            name: <string>account.profile.name,
            email: <string>account.profile.email,
            password: <string>account.profile.password,
         },
      });
   }

   async getAccountById(id: ID): Promise<UserAccount> {
      return await this.accountRepository.getAccountById(id);
   }

   async getProfileByUsername(username: string): Promise<UserAccount> {
      return await this.accountRepository.getAccount({
         profile: {
            username,
         },
      } as UserAccount);
   }
}

export default AccountService;
