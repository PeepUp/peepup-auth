-- CreateEnum
CREATE TYPE "SocialMediaType" AS ENUM ('threads', 'instagram', 'linkedin', 'facebook', 'github', 'twitter');

-- CreateTable
CREATE TABLE "social_media_links" (
    "id" SERIAL NOT NULL,
    "type" "SocialMediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,

    CONSTRAINT "social_media_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "social_media_links" ADD CONSTRAINT "social_media_links_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
