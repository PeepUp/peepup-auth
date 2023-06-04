import type { BaseEntity } from "common/types";

export class AccountEntity implements BaseEntity {
   readonly id: number;
   readonly roles: string;
   readonly createdAt: Date;
   readonly updatedAt: Date;
   readonly providerId: Date;
}
