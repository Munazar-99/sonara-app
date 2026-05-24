/*
  Warnings:

  - You are about to alter the column `customerCost` on the `Call` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.
  - You are about to alter the column `profit` on the `Call` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.
  - You are about to alter the column `providerCost` on the `Call` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.
  - You are about to alter the column `totalProviderCost` on the `MonthlyUsage` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.
  - You are about to alter the column `totalCustomerCost` on the `MonthlyUsage` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.
  - You are about to alter the column `totalProfit` on the `MonthlyUsage` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE "Call" ALTER COLUMN "customerCost" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "profit" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "providerCost" SET DATA TYPE DECIMAL(10,3);

-- AlterTable
ALTER TABLE "MonthlyUsage" ALTER COLUMN "totalProviderCost" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "totalCustomerCost" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "totalProfit" SET DATA TYPE DECIMAL(10,3);
