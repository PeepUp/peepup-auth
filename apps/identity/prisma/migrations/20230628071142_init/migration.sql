/*
  Warnings:

  - You are about to drop the column `access_token` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `blacklisted_access_token` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `blacklisted_refresh_token` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `whitelisted_jti` on the `tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenTypes` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Made the column `nbf` on table `tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expires_at` on table `tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "access_token",
DROP COLUMN "blacklisted_access_token",
DROP COLUMN "blacklisted_refresh_token",
DROP COLUMN "refresh_token",
DROP COLUMN "updatedAt",
DROP COLUMN "whitelisted_jti",
ADD COLUMN     "expirationTime" TIMESTAMP(3),
ADD COLUMN     "revocationStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tokenTypes" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL,
ALTER COLUMN "nbf" SET NOT NULL,
ALTER COLUMN "expires_at" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tokens_value_key" ON "tokens"("value");
