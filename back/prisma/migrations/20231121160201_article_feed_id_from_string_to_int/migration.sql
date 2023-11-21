/*
  Warnings:

  - The primary key for the `Article` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Article` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Feed` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Feed` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `source_feed_id` on the `Article` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_source_feed_id_fkey";

-- DropIndex
DROP INDEX "Article_id_key";

-- DropIndex
DROP INDEX "Feed_id_key";

-- AlterTable
ALTER TABLE "Article" DROP CONSTRAINT "Article_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "source_feed_id",
ADD COLUMN     "source_feed_id" INTEGER NOT NULL,
ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Feed" DROP CONSTRAINT "Feed_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Feed_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Article_source_feed_id_idx" ON "Article"("source_feed_id");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_source_feed_id_fkey" FOREIGN KEY ("source_feed_id") REFERENCES "Feed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
