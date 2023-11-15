/*
  Warnings:

  - The `state` column on the `identities` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "IdentityStateTypes" AS ENUM ('active', 'deactive', 'pending', 'blocked', 'deleted', 'archived', 'unknown', 'unverified');

-- AlterTable
ALTER TABLE "identities" DROP COLUMN "state",
ADD COLUMN     "state" "IdentityStateTypes" NOT NULL DEFAULT 'active';
