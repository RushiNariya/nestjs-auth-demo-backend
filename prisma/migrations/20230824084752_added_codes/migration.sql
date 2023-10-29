/*
  Warnings:

  - You are about to drop the `Code` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Code` DROP FOREIGN KEY `Code_userId_fkey`;

-- DropTable
DROP TABLE `Code`;

-- CreateTable
CREATE TABLE `codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `codes_code_key`(`code`),
    UNIQUE INDEX `codes_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `codes` ADD CONSTRAINT `codes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
