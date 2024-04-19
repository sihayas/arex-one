-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `apple_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `password_hash` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'active',
    `follow_notifications` BOOLEAN NOT NULL DEFAULT true,
    `reply_notifications` BOOLEAN NOT NULL DEFAULT true,
    `heart_notifications` BOOLEAN NOT NULL DEFAULT true,
    `updated_at` DATETIME(3) NULL,
    `last_active` DATETIME(3) NULL,
    `date_joined` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_apple_id_key`(`apple_id`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,

    INDEX `Session_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entry` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `sound_id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NULL,
    `rating` DOUBLE NULL,
    `loved` BOOLEAN NULL DEFAULT false,
    `replay` BOOLEAN NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Entry_author_id_idx`(`author_id`),
    INDEX `Entry_sound_id_idx`(`sound_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follows` (
    `id` VARCHAR(191) NOT NULL,
    `follower_id` VARCHAR(191) NOT NULL,
    `following_id` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Follows_follower_id_idx`(`follower_id`),
    INDEX `Follows_following_id_idx`(`following_id`),
    UNIQUE INDEX `Follows_follower_id_following_id_key`(`follower_id`, `following_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sound` (
    `id` VARCHAR(191) NOT NULL,
    `apple_id` VARCHAR(191) NOT NULL,
    `upc` VARCHAR(191) NULL,
    `isrc` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `artist_name` VARCHAR(191) NOT NULL,
    `release_date` VARCHAR(191) NOT NULL,
    `album_name` VARCHAR(191) NULL,
    `album_id` VARCHAR(191) NULL,
    `avg_rating` DOUBLE NOT NULL DEFAULT 0,
    `bayesian_avg` DOUBLE NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Sound_apple_id_key`(`apple_id`),
    UNIQUE INDEX `Sound_upc_key`(`upc`),
    UNIQUE INDEX `Sound_isrc_key`(`isrc`),
    INDEX `Sound_id_idx`(`id`),
    INDEX `Sound_apple_id_idx`(`apple_id`),
    INDEX `Sound_album_id_idx`(`album_id`),
    UNIQUE INDEX `Sound_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reply` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `reply_to_id` VARCHAR(191) NULL,
    `root_id` VARCHAR(191) NULL,
    `entry_id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Reply_reply_to_id_idx`(`reply_to_id`),
    INDEX `Reply_root_id_idx`(`root_id`),
    INDEX `Reply_entry_id_idx`(`entry_id`),
    INDEX `Reply_author_id_idx`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `entry_id` VARCHAR(191) NULL,
    `reply_id` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Action_author_id_idx`(`author_id`),
    INDEX `Action_entry_id_idx`(`entry_id`),
    INDEX `Action_reply_id_idx`(`reply_id`),
    UNIQUE INDEX `Action_author_id_entry_id_type_key`(`author_id`, `entry_id`, `type`),
    UNIQUE INDEX `Action_author_id_reply_id_type_key`(`author_id`, `reply_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activity` (
    `id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `action_id` VARCHAR(191) NULL,
    `reply_id` VARCHAR(191) NULL,
    `entry_id` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Activity_action_id_key`(`action_id`),
    UNIQUE INDEX `Activity_reply_id_key`(`reply_id`),
    UNIQUE INDEX `Activity_entry_id_key`(`entry_id`),
    INDEX `Activity_author_id_idx`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `recipient_id` VARCHAR(191) NOT NULL,
    `author_id` VARCHAR(191) NOT NULL,
    `activity_id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Notification_activity_id_key`(`activity_id`),
    INDEX `Notification_author_id_idx`(`author_id`),
    INDEX `Notification_recipient_id_idx`(`recipient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OauthAccount` (
    `providerId` VARCHAR(191) NOT NULL,
    `providerUserId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `OauthAccount_userId_idx`(`userId`),
    PRIMARY KEY (`providerId`, `providerUserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SoundToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SoundToUser_AB_unique`(`A`, `B`),
    INDEX `_SoundToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

