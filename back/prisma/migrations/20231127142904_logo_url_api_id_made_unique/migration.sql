/*
  Warnings:

  - A unique constraint covering the columns `[logo_url]` on the table `Crypto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[api_id]` on the table `Crypto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Crypto_logo_url_key" ON "Crypto"("logo_url");

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_api_id_key" ON "Crypto"("api_id");
