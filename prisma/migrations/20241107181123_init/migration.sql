-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "channelId" INTEGER;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
