-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('WEB', 'WHATSAPP');

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "capture" JSONB,
ADD COLUMN     "channel" "Channel" NOT NULL DEFAULT 'WEB',
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "externalId" TEXT;

-- CreateTable
CREATE TABLE "whatsapp_contacts" (
    "id" TEXT NOT NULL,
    "waId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profileName" TEXT,
    "department" "Department",
    "lastInboundAt" TIMESTAMP(3),
    "lastOutboundAt" TIMESTAMP(3),
    "optedOut" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_contacts_waId_key" ON "whatsapp_contacts"("waId");

-- CreateIndex
CREATE INDEX "whatsapp_contacts_department_idx" ON "whatsapp_contacts"("department");

-- CreateIndex
CREATE INDEX "whatsapp_contacts_lastInboundAt_idx" ON "whatsapp_contacts"("lastInboundAt");

-- CreateIndex
CREATE INDEX "conversations_channel_contactPhone_updatedAt_idx" ON "conversations"("channel", "contactPhone", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "messages_externalId_key" ON "messages"("externalId");
