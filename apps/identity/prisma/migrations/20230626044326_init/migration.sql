/*
  Warnings:

  - A unique constraint covering the columns `[email,username,phoneNumber]` on the table `identities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "identities_email_username_phoneNumber_key" ON "identities"("email", "username", "phoneNumber");
