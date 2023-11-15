/*
  Warnings:

  - Made the column `state` on table `identities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `identities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `identities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar` on table `identities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `identities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "identities" ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "state" SET DEFAULT 'active',
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "firstName" SET DEFAULT '',
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "lastName" SET DEFAULT '',
ALTER COLUMN "avatar" SET NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT '',
ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "username" SET DEFAULT '';
