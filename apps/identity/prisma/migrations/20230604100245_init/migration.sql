/*
  Warnings:

  - You are about to drop the column `providerAccountId` on the `Account` table. All the data in the column will be lost.
  - Added the required column `userProviderId` to the `Provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "providerAccountId";

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "userProviderId" TEXT NOT NULL;
