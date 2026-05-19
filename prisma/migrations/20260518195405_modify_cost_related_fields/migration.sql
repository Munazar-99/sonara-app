/*
  Warnings:

  - You are about to drop the column `callsMade` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `currentSpend` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `minutesUsed` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "callsMade",
DROP COLUMN "currentSpend",
DROP COLUMN "minutesUsed",
ADD COLUMN     "currentMonthCalls" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentMonthCost" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "currentMonthMinutes" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "updatedAt" DROP DEFAULT;
