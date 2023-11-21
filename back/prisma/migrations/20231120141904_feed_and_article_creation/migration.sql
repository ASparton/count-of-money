-- CreateTable
CREATE TABLE "Feed" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "image_url" TEXT,
    "content" TEXT NOT NULL,
    "published" TIMESTAMP(3) NOT NULL,
    "source_feed_id" TEXT NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feed_id_key" ON "Feed"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Feed_url_key" ON "Feed"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Article_id_key" ON "Article"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Article_url_key" ON "Article"("url");

-- CreateIndex
CREATE INDEX "Article_source_feed_id_idx" ON "Article"("source_feed_id");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_source_feed_id_fkey" FOREIGN KEY ("source_feed_id") REFERENCES "Feed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
