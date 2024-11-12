-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "channelId" INTEGER;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
