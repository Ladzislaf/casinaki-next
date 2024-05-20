/*
  Warnings:

  - You are about to drop the column `value_to_achieve` on the `Rank` table. All the data in the column will be lost.
  - Added the required column `valueToAchieve` to the `Rank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rank" DROP COLUMN "value_to_achieve",
ADD COLUMN     "valueToAchieve" INTEGER NOT NULL;
