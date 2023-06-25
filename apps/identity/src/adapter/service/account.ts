import { AccountRepository } from "@/application/repository/accounts";
import type { AccountContract, ID } from "@/types/types";
import Account from "../../domain/entity/account";
import { LOGIN_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE } from "../schema/account.schema";

import { passwordUtils } from "../../common/utils";

class AccountService {
   constructor(private readonly accountRepository: AccountRepository) {}

   async registerAccount({
      email,
      password,
   }: {
      email: string;
      password: string;
   }): Promise<void> {
      const hashedPassword = await passwordUtils.hash({
         password,
         salt: await passwordUtils.generateSalt(16),
      });

      const user = {
         email,
         password: hashedPassword,
      };

      const account = new Account({
         user,
      });

      await this.accountRepository.createAccount({
         profile: {
            email: <string>account.user.email,
            password: <string>account.user.password,
         },
      });
   }

   async loginAccount({
      email,
      password,
   }: LOGIN_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE): Promise<AccountContract> {
      const account = await this.getProfileByEmail(email);

      const verifyPassword = await passwordUtils.verify({
         password: password,
         hashedPassword: <string>account.user.password,
      });

      if (!verifyPassword) throw new Error("Email or Password is incorrect");

      return account;
   }

   async getAccountById(id: ID): Promise<AccountContract> {
      const { user } = await this.accountRepository.getAccountById(id);
      return { user } as AccountContract;
   }

   async getProfileByEmail(email: string): Promise<AccountContract> {
      return await this.accountRepository.getAccount({
         user: {
            email,
         },
      } as AccountContract);
   }

   async getProfileByUsername(username: string): Promise<AccountContract> {
      return await this.accountRepository.getAccount({
         user: {
            username,
         },
      } as AccountContract);
   }
}

export default AccountService;
