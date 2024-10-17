/*
  Warnings:

  - Added the required column `productsSold` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesCount` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "productsSold" INTEGER NOT NULL,
ADD COLUMN     "salesCount" INTEGER NOT NULL;
