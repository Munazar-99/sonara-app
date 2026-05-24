/*
  Warnings:

  - You are about to drop the column `currentMonthCost` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `currentMonthMinutes` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "currentMonthCost",
DROP COLUMN "currentMonthMinutes",
ADD COLUMN     "currentMonthDuration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentMonthProfit" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "currentMonthSpend" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
