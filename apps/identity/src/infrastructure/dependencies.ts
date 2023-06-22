import AccountService from "@/adapter/service/account";
import { Container } from "inversify";

export interface Dependencies {
   accountService: AccountService;
}
