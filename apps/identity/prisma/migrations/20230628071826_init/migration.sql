/*
  Warnings:

  - You are about to drop the column `signature` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `kid` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Made the column `expirationTime` on table `tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "signature",
ADD COLUMN     "kid" TEXT NOT NULL,
ALTER COLUMN "expirationTime" SET NOT NULL;
