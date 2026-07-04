-- CreateEnum
CREATE TYPE "SeriesSource" AS ENUM ('BCB', 'FRED');

-- CreateEnum
CREATE TYPE "SeriesType" AS ENUM ('DAILY', 'MONTHLY');

-- CreateTable
CREATE TABLE "indicators" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" "SeriesSource" NOT NULL,
    "sourceSeriesId" TEXT NOT NULL,
    "seriesType" "SeriesType" NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indicators_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "observations" (
    "id" SERIAL NOT NULL,
    "indicatorCode" TEXT NOT NULL,
    "referenceDate" DATE NOT NULL,
    "value" DECIMAL(18,6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "indicatorCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("indicatorCode")
);

-- CreateTable
CREATE TABLE "sync_state" (
    "indicatorCode" TEXT NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "lastStatus" TEXT,
    "lastError" TEXT,

    CONSTRAINT "sync_state_pkey" PRIMARY KEY ("indicatorCode")
);

-- CreateIndex
CREATE INDEX "observations_indicatorCode_referenceDate_idx" ON "observations"("indicatorCode", "referenceDate");

-- CreateIndex
CREATE UNIQUE INDEX "observations_indicatorCode_referenceDate_key" ON "observations"("indicatorCode", "referenceDate");

-- AddForeignKey
ALTER TABLE "observations" ADD CONSTRAINT "observations_indicatorCode_fkey" FOREIGN KEY ("indicatorCode") REFERENCES "indicators"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_indicatorCode_fkey" FOREIGN KEY ("indicatorCode") REFERENCES "indicators"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_state" ADD CONSTRAINT "sync_state_indicatorCode_fkey" FOREIGN KEY ("indicatorCode") REFERENCES "indicators"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
