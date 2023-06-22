import { PrismaClient } from "@prisma/client";
import PrismaAccountDataSourceAdapter from "./data-source/account-data-source";
import { AccountRepository } from "../application/repository/accounts";
import AccountService from "../adapter/service/account";

import type { Dependencies } from "./dependencies";

const prisma = new PrismaClient();

const accountService = new AccountService(
   new AccountRepository(new PrismaAccountDataSourceAdapter(prisma))
);

export const dependencies: Dependencies = {
   accountService,
};
