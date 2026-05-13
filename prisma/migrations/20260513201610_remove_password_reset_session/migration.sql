/*
  Warnings:

  - You are about to drop the `password_reset_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "password_reset_session" DROP CONSTRAINT "password_reset_session_userId_fkey";

-- DropTable
DROP TABLE "password_reset_session";
