/*
  Warnings:

  - You are about to drop the column `userId` on the `Role` table. All the data in the column will be lost.
  - The `type` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `userId` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[identityId]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('admin', 'volunteer', 'organization');

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userId_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_providerId_fkey";

-- DropIndex
DROP INDEX "Role_userId_key";

-- DropIndex
DROP INDEX "userId";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "userId",
ADD COLUMN     "identityId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "UserRoleType" NOT NULL DEFAULT 'volunteer';

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "userId",
ADD COLUMN     "identityId" TEXT;

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "UserRoleEnum";

-- CreateTable
CREATE TABLE "identities" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "state" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "emailVerified" TIMESTAMP(3),
    "avatar" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "providerId" INTEGER,

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identities_username_key" ON "identities"("username");

-- CreateIndex
CREATE UNIQUE INDEX "identities_email_key" ON "identities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "identities_phone_key" ON "identities"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Role_identityId_key" ON "Role"("identityId");

-- CreateIndex
CREATE INDEX "identityId" ON "tokens"("identityId");

-- AddForeignKey
ALTER TABLE "identities" ADD CONSTRAINT "identities_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
