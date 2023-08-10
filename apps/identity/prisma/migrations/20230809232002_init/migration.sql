/*
  Warnings:

  - You are about to drop the column `algorithm` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `header` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nbf` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "algorithm",
ADD COLUMN     "header" JSONB NOT NULL,
ADD COLUMN     "nbf" INTEGER NOT NULL,
ADD COLUMN     "payload" JSONB NOT NULL;
