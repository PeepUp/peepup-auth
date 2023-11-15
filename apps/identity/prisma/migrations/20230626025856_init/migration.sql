/*
  Warnings:

  - You are about to drop the column `userId` on the `provider` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userId_fkey";

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_providerId_fkey";

-- DropForeignKey
ALTER TABLE "provider" DROP CONSTRAINT "provider_userId_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_accountId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_accountId_fkey";

-- DropIndex
DROP INDEX "accountId";

-- DropIndex
DROP INDEX "users_accountId_key";

-- AlterTable
ALTER TABLE "provider" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "accountId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "accountId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "providerId" INTEGER,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "accounts";

-- CreateIndex
CREATE INDEX "userId" ON "tokens"("userId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
