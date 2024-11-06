/*
  Warnings:

  - You are about to drop the column `metric` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `targetValue` on the `Goal` table. All the data in the column will be lost.
  - Added the required column `faturamento` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalType` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ledsGerados` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroVendas` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produtosVendidos` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorInvestido` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('COLLABORATOR', 'SALES');

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "metric",
DROP COLUMN "targetValue",
ADD COLUMN     "faturamento" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "goalType" "GoalType" NOT NULL,
ADD COLUMN     "ledsGerados" INTEGER NOT NULL,
ADD COLUMN     "numeroVendas" INTEGER NOT NULL,
ADD COLUMN     "produtosVendidos" INTEGER NOT NULL,
ADD COLUMN     "valorInvestido" DOUBLE PRECISION NOT NULL;
