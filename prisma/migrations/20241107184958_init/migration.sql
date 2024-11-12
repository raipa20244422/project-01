/*
  Warnings:

  - Made the column `channelId` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_channelId_fkey";

-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "channelId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
