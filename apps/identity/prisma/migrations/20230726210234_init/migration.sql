/*
  Warnings:

  - You are about to drop the column `permissionId` on the `attributes` table. All the data in the column will be lost.
  - The primary key for the `permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `resource` on the `permissions` table. All the data in the column will be lost.
  - Added the required column `subject` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('manage', 'create', 'update', 'read', 'delete');

-- DropForeignKey
ALTER TABLE "attributes" DROP CONSTRAINT "attributes_permissionId_fkey";

-- AlterTable
ALTER TABLE "attributes" DROP COLUMN "permissionId";

-- AlterTable
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_pkey",
DROP COLUMN "resource",
ADD COLUMN     "conditions" JSONB,
ADD COLUMN     "fields" TEXT[],
ADD COLUMN     "inverted" BOOLEAN DEFAULT false,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "subject" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "action",
ADD COLUMN     "action" "Action" NOT NULL,
ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "permissions_id_seq";
