-- CreateTable
CREATE TABLE `Tables` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `family` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chains` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `hook` VARCHAR(191) NOT NULL,
    `priority` INTEGER NOT NULL,
    `policy` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `tableId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `position` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `counter` BOOLEAN NOT NULL,
    `enabled` BOOLEAN NOT NULL,
    `setTarget` VARCHAR(191) NOT NULL,
    `natTarget` VARCHAR(191) NOT NULL,
    `logPrefix` VARCHAR(191) NOT NULL,
    `logLevel` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `chainId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logDatetime` DATETIME(3) NOT NULL,
    `sourceIp` VARCHAR(191) NOT NULL,
    `sourcePort` INTEGER NOT NULL,
    `destIp` VARCHAR(191) NOT NULL,
    `destPort` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chains` ADD CONSTRAINT `Chains_tableId_fkey` FOREIGN KEY (`tableId`) REFERENCES `Tables`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rules` ADD CONSTRAINT `Rules_chainId_fkey` FOREIGN KEY (`chainId`) REFERENCES `Chains`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
