/*
  Warnings:

  - You are about to drop the column `revocationStatus` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `tokenStatus` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenStatusTypes" AS ENUM ('revoked', 'signed', 'expired', 'revokedAndExpired', 'error', 'active', 'queued', 'pending', 'unknown');

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "revocationStatus",
ADD COLUMN     "tokenStatus" "TokenStatusTypes" NOT NULL;

-- CreateIndex
CREATE INDEX "tokenValueIndex" ON "tokens"("value");

-- CreateIndex
CREATE INDEX "tokenJtiIndex" ON "tokens"("jti");

-- RenameIndex
ALTER INDEX "identityId" RENAME TO "tokenIdentityIdIndex";

-- RenameIndex
ALTER INDEX "tokenIdentityId" RENAME TO "whitelistedTokenIdentityIdIndex";
