/*
  Warnings:

  - You are about to drop the column `phone` on the `identities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `identities` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "identities_phone_key";

-- AlterTable
ALTER TABLE "identities" DROP COLUMN "phone",
ADD COLUMN     "phoneNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "identities_phoneNumber_key" ON "identities"("phoneNumber");
