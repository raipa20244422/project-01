/*
  Warnings:

  - Added the required column `saleDate` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "saleDate" TIMESTAMP(3) NOT NULL;
