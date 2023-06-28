/*
  Warnings:

  - The values [pending] on the enum `TokenStatusTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TokenStatusTypes_new" AS ENUM ('revoked', 'signed', 'expired', 'revokedAndExpired', 'error', 'active', 'queued', 'unknown', 'rotated');
ALTER TABLE "tokens" ALTER COLUMN "tokenStatus" TYPE "TokenStatusTypes_new" USING ("tokenStatus"::text::"TokenStatusTypes_new");
ALTER TYPE "TokenStatusTypes" RENAME TO "TokenStatusTypes_old";
ALTER TYPE "TokenStatusTypes_new" RENAME TO "TokenStatusTypes";
DROP TYPE "TokenStatusTypes_old";
COMMIT;
