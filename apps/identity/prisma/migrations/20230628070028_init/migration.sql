/*
  Warnings:

  - The `expires_at` column on the `tokens` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `header` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jti` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signature` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whitelisted_jti` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "header" JSONB NOT NULL,
ADD COLUMN     "jti" TEXT NOT NULL,
ADD COLUMN     "nbf" INTEGER,
ADD COLUMN     "payload" JSONB NOT NULL,
ADD COLUMN     "signature" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "whitelisted_jti" TEXT NOT NULL,
DROP COLUMN "expires_at",
ADD COLUMN     "expires_at" INTEGER;

-- CreateTable
CREATE TABLE "tokens_whitelisted" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "identityId" TEXT,

    CONSTRAINT "tokens_whitelisted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tokenIdentityId" ON "tokens_whitelisted"("identityId");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_whitelisted_tokenId_identityId_key" ON "tokens_whitelisted"("tokenId", "identityId");

-- AddForeignKey
ALTER TABLE "tokens_whitelisted" ADD CONSTRAINT "tokens_whitelisted_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens_whitelisted" ADD CONSTRAINT "tokens_whitelisted_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
