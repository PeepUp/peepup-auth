/*
  Warnings:

  - You are about to drop the column `tokenType` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `type` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "tokenType",
ADD COLUMN     "type" "TokenTypes" NOT NULL;
