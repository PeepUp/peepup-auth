import PrismaAccountDataSourceAdapter from "./data-source/account-data-source";
import { AccountRepository } from "../application/repository/accounts";
import AccountService from "../adapter/service/account";
import prisma from "./prisma";

import type { Dependencies } from "./dependencies";

const accountService = new AccountService(
   new AccountRepository(new PrismaAccountDataSourceAdapter(prisma))
);

export const dependencies: Dependencies = {
   accountService,
};
