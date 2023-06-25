/*
  Warnings:

  - Added the required column `blacklisted_access_token` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blacklisted_refresh_token` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "blacklisted_access_token" TEXT NOT NULL,
ADD COLUMN     "blacklisted_refresh_token" TEXT NOT NULL;
