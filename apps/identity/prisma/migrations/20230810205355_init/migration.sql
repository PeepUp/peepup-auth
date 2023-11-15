/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `identities` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attributes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('admin', 'member', 'volunteer', 'organization');

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_identityId_fkey";

-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_roleId_fkey";

-- AlterTable
ALTER TABLE "identities" DROP COLUMN "isAdmin",
ADD COLUMN     "role" "SystemRole" NOT NULL DEFAULT 'member';

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "attributes";

-- DropTable
DROP TABLE "permissions";

-- DropEnum
DROP TYPE "UserRoleTypes";
