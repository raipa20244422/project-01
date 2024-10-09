/*
  Warnings:

  - You are about to drop the column `leadTypeId` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the `LeadType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_leadTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_userId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_userId_fkey";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "leadTypeId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "userId";

-- DropTable
DROP TABLE "LeadType";

-- DropEnum
DROP TYPE "Profile";
