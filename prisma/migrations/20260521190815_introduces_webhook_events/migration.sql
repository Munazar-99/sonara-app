/*
  Warnings:

  - You are about to alter the column `customerCost` on the `Call` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `profit` on the `Call` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `providerCost` on the `Call` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `currentMonthCalls` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `currentMonthDuration` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `currentMonthProfit` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `currentMonthSpend` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `billingRate` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.

*/
-- CreateEnum
CREATE TYPE "WebhookEventStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- AlterTable
ALTER TABLE "Call" ALTER COLUMN "customerCost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "profit" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "providerCost" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "auth_tokens" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "currentMonthCalls",
DROP COLUMN "currentMonthDuration",
DROP COLUMN "currentMonthProfit",
DROP COLUMN "currentMonthSpend",
ALTER COLUMN "billingRate" DROP DEFAULT,
ALTER COLUMN "billingRate" SET DATA TYPE DECIMAL(10,4);

-- CreateTable
CREATE TABLE "MonthlyUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "totalCalls" INTEGER NOT NULL DEFAULT 0,
    "totalDurationSec" INTEGER NOT NULL DEFAULT 0,
    "totalProviderCost" DECIMAL(10,2) NOT NULL,
    "totalCustomerCost" DECIMAL(10,2) NOT NULL,
    "totalProfit" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "externalEventId" TEXT,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MonthlyUsage_userId_idx" ON "MonthlyUsage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyUsage_userId_year_month_key" ON "MonthlyUsage"("userId", "year", "month");

-- CreateIndex
CREATE INDEX "WebhookEvent_status_idx" ON "WebhookEvent"("status");

-- CreateIndex
CREATE INDEX "WebhookEvent_createdAt_idx" ON "WebhookEvent"("createdAt");

-- CreateIndex
CREATE INDEX "auth_tokens_userId_type_idx" ON "auth_tokens"("userId", "type");

-- AddForeignKey
ALTER TABLE "MonthlyUsage" ADD CONSTRAINT "MonthlyUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
