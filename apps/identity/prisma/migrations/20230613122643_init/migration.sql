/*
  Warnings:

  - The values [ADMIN,VOLUNTEER,ORGANIZATION] on the enum `UserRoleEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRoleEnum_new" AS ENUM ('Admin', 'Volunteer', 'Organization');
ALTER TABLE "Role" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Role" ALTER COLUMN "type" TYPE "UserRoleEnum_new" USING ("type"::text::"UserRoleEnum_new");
ALTER TYPE "UserRoleEnum" RENAME TO "UserRoleEnum_old";
ALTER TYPE "UserRoleEnum_new" RENAME TO "UserRoleEnum";
DROP TYPE "UserRoleEnum_old";
ALTER TABLE "Role" ALTER COLUMN "type" SET DEFAULT 'Volunteer';
COMMIT;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "type" SET DEFAULT 'Volunteer';
