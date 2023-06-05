/*
  Warnings:

  - You are about to drop the column `accountID` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_accountID_fkey";

-- DropIndex
DROP INDEX "users_accountID_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "accountID",
ADD COLUMN     "accountId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_accountId_key" ON "users"("accountId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
