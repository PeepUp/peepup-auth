/*
  Warnings:

  - You are about to drop the column `header` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `nbf` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `payload` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `algorithm` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "header",
DROP COLUMN "nbf",
DROP COLUMN "payload",
ADD COLUMN     "algorithm" TEXT NOT NULL;
