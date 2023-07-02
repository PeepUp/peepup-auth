/*
  Warnings:

  - The primary key for the `tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tokens` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokens_whitelisted" DROP CONSTRAINT "tokens_whitelisted_tokenId_fkey";

-- AlterTable
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "tokens_pkey" PRIMARY KEY ("jti");

-- AlterTable
ALTER TABLE "tokens_whitelisted" ALTER COLUMN "tokenId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "tokens_whitelisted" ADD CONSTRAINT "tokens_whitelisted_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "tokens"("jti") ON DELETE RESTRICT ON UPDATE CASCADE;
