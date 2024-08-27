-- CreateTable
CREATE TABLE "Reading" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "measure_uuid" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reading_measure_uuid_key" ON "Reading"("measure_uuid");
