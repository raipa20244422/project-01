/*
  Warnings:

  - Added the required column `data` to the `Collaborator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collaborator" ADD COLUMN     "data" TIMESTAMP(3) NOT NULL;
