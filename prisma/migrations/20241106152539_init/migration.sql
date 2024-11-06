-- AddForeignKey
ALTER TABLE "CollaboratorItem" ADD CONSTRAINT "CollaboratorItem_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
