import { AccountRepository } from "@/application/repository/accounts";
import { ID, UserAccount, passwordUtils } from "../../common";
import Account from "../../domain/entity/account";
import {
   CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE,
   LOGIN_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE,
} from "../schema/account.schema";

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

      console.log({
         name,
         email,
         password,
         hashedPassword,
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

   async loginAccount({
      email,
      password,
   }: LOGIN_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE): Promise<UserAccount> {
      const account = await this.getProfileByEmail(email);

      const verifyPassword = await passwordUtils.verify({
         password: password,
         hashedPassword: <string>account.profile.password,
      });

      console.log({
         account,
         verifyPassword,
      });
      if (!verifyPassword) throw new Error("Email or Password is incorrect");

      return account;
   }

   async getAccountById(id: ID): Promise<UserAccount> {
      const { profile } = await this.accountRepository.getAccountById(id);
      return profile as UserAccount;
   }

   async getProfileByEmail(email: string): Promise<UserAccount> {
      return await this.accountRepository.getAccount({
         profile: {
            email,
         },
      } as UserAccount);
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
