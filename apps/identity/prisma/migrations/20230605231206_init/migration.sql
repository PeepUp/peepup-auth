/*
  Warnings:

  - You are about to drop the column `UserId` on the `provider` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "provider" DROP CONSTRAINT "provider_UserId_fkey";

-- AlterTable
ALTER TABLE "provider" DROP COLUMN "UserId",
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "provider" ADD CONSTRAINT "provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
