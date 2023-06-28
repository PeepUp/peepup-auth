/*
  Warnings:

  - The `type` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `tokenTypes` on the `tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRoleTypes" AS ENUM ('admin', 'volunteer', 'organization');

-- CreateEnum
CREATE TYPE "TokenTypes" AS ENUM ('access', 'refresh');

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "type",
ADD COLUMN     "type" "UserRoleTypes" NOT NULL DEFAULT 'volunteer';

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "tokenTypes",
ADD COLUMN     "tokenTypes" "TokenTypes" NOT NULL;

-- AlterTable
ALTER TABLE "tokens_whitelisted" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "UserRoleType";
