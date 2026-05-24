/*
  Warnings:

  - You are about to drop the column `cost` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the `UsagePeriod` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customerCost` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerCost` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsagePeriod" DROP CONSTRAINT "UsagePeriod_userId_fkey";

-- AlterTable
ALTER TABLE "Call" DROP COLUMN "cost",
ADD COLUMN     "customerCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "profit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "providerCost" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "UsagePeriod";
