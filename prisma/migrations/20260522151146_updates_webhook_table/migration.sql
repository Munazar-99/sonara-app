-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WebhookEventStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "WebhookEventStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "WebhookEvent" ADD COLUMN     "headers" JSONB,
ADD COLUMN     "rawBody" TEXT,
ADD COLUMN     "responseStatus" INTEGER,
ADD COLUMN     "signature" TEXT,
ALTER COLUMN "eventType" DROP NOT NULL,
ALTER COLUMN "payload" DROP NOT NULL;
