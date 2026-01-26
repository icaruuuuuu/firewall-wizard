/*
  Warnings:

  - You are about to drop the column `logDatetime` on the `Logs` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `counter` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `logLevel` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `logPrefix` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `natTarget` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Rules` table. All the data in the column will be lost.
  - You are about to drop the column `setTarget` on the `Rules` table. All the data in the column will be lost.
  - Added the required column `expression` to the `Rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `match` to the `Rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchType` to the `Rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statement` to the `Rules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Logs` DROP COLUMN `logDatetime`,
    ADD COLUMN `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Rules` DROP COLUMN `action`,
    DROP COLUMN `counter`,
    DROP COLUMN `description`,
    DROP COLUMN `enabled`,
    DROP COLUMN `logLevel`,
    DROP COLUMN `logPrefix`,
    DROP COLUMN `natTarget`,
    DROP COLUMN `position`,
    DROP COLUMN `setTarget`,
    ADD COLUMN `expression` VARCHAR(191) NOT NULL,
    ADD COLUMN `match` VARCHAR(191) NOT NULL,
    ADD COLUMN `matchType` VARCHAR(191) NOT NULL,
    ADD COLUMN `statement` VARCHAR(191) NOT NULL;
