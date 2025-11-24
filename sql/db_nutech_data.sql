/*
 Navicat Premium Dump SQL

 Source Server         : Database 
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : db_nutech

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 24/11/2025 21:50:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for balance
-- ----------------------------
DROP TABLE IF EXISTS `balance`;
CREATE TABLE `balance`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(20, 2) NOT NULL DEFAULT 0.00,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `balance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of balance
-- ----------------------------
INSERT INTO `balance` VALUES (1, 1, 0.00, '2025-11-24 19:12:11');
INSERT INTO `balance` VALUES (2, 2, 11.00, '2025-11-24 21:42:00');

-- ----------------------------
-- Table structure for banner
-- ----------------------------
DROP TABLE IF EXISTS `banner`;
CREATE TABLE `banner`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `banner_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of banner
-- ----------------------------
INSERT INTO `banner` VALUES (1, 'Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '2025-11-24 20:40:47');
INSERT INTO `banner` VALUES (2, 'Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '2025-11-24 20:40:47');
INSERT INTO `banner` VALUES (3, 'Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '2025-11-24 20:40:47');
INSERT INTO `banner` VALUES (4, 'Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '2025-11-24 20:40:47');
INSERT INTO `banner` VALUES (5, 'Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '2025-11-24 20:40:47');
INSERT INTO `banner` VALUES (6, 'Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet', '2025-11-24 20:40:47');

-- ----------------------------
-- Table structure for services
-- ----------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services`  (
  `service_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `service_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `service_icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `service_tariff` int NULL DEFAULT NULL,
  PRIMARY KEY (`service_code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of services
-- ----------------------------
INSERT INTO `services` VALUES ('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO `services` VALUES ('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000);
INSERT INTO `services` VALUES ('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO `services` VALUES ('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000);
INSERT INTO `services` VALUES ('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO `services` VALUES ('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000);
INSERT INTO `services` VALUES ('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000);
INSERT INTO `services` VALUES ('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000);
INSERT INTO `services` VALUES ('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO `services` VALUES ('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000);
INSERT INTO `services` VALUES ('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000);
INSERT INTO `services` VALUES ('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);

-- ----------------------------
-- Table structure for transaction_history
-- ----------------------------
DROP TABLE IF EXISTS `transaction_history`;
CREATE TABLE `transaction_history`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `invoice_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '0.00',
  `transaction_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `total_amount` bigint NULL DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `transaction_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of transaction_history
-- ----------------------------
INSERT INTO `transaction_history` VALUES (1, 2, 'INV20251124142821-3693', 'TOPUP', 'Top Up balance', 1000000, '2025-11-24 21:28:21', '2025-11-24 21:28:21');
INSERT INTO `transaction_history` VALUES (2, 2, 'INV20251124143021-1081', 'TOPUP', 'Top Up balance', 1000000, '2025-11-24 21:30:21', '2025-11-24 21:30:21');
INSERT INTO `transaction_history` VALUES (3, 2, 'INV20251124143123-6797', 'TOPUP', 'Top Up balance', 1000000, '2025-11-24 21:31:23', '2025-11-24 21:31:23');
INSERT INTO `transaction_history` VALUES (4, 2, 'PULSA', 'INV20251124143951-7232', 'Pembayaran Pulsa', 40000, '2025-11-24 21:39:51', '2025-11-24 21:39:51');
INSERT INTO `transaction_history` VALUES (5, 2, 'INV20251124144033-4729', 'PULSA', 'Pembayaran Pulsa', 40000, '2025-11-24 21:40:33', '2025-11-24 21:40:33');
INSERT INTO `transaction_history` VALUES (6, 2, 'INV20251124144114-7432', 'PLN', 'Pembayaran Listrik', 10000, '2025-11-24 21:41:14', '2025-11-24 21:41:14');
INSERT INTO `transaction_history` VALUES (7, 2, 'INV20251124144125-9055', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:25', '2025-11-24 21:41:25');
INSERT INTO `transaction_history` VALUES (8, 2, 'INV20251124144126-4361', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:26', '2025-11-24 21:41:26');
INSERT INTO `transaction_history` VALUES (9, 2, 'INV20251124144128-1946', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:28', '2025-11-24 21:41:28');
INSERT INTO `transaction_history` VALUES (10, 2, 'INV20251124144129-2716', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:29', '2025-11-24 21:41:29');
INSERT INTO `transaction_history` VALUES (11, 2, 'INV20251124144129-4810', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:29', '2025-11-24 21:41:29');
INSERT INTO `transaction_history` VALUES (12, 2, 'INV20251124144130-9637', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:30', '2025-11-24 21:41:30');
INSERT INTO `transaction_history` VALUES (13, 2, 'INV20251124144131-6501', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:31', '2025-11-24 21:41:31');
INSERT INTO `transaction_history` VALUES (14, 2, 'INV20251124144131-6969', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:31', '2025-11-24 21:41:31');
INSERT INTO `transaction_history` VALUES (15, 2, 'INV20251124144136-4822', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:36', '2025-11-24 21:41:36');
INSERT INTO `transaction_history` VALUES (16, 2, 'INV20251124144137-8627', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:37', '2025-11-24 21:41:37');
INSERT INTO `transaction_history` VALUES (17, 2, 'INV20251124144138-7558', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:38', '2025-11-24 21:41:38');
INSERT INTO `transaction_history` VALUES (18, 2, 'INV20251124144138-1952', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:38', '2025-11-24 21:41:38');
INSERT INTO `transaction_history` VALUES (19, 2, 'INV20251124144139-3284', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:39', '2025-11-24 21:41:39');
INSERT INTO `transaction_history` VALUES (20, 2, 'INV20251124144140-2144', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:40', '2025-11-24 21:41:40');
INSERT INTO `transaction_history` VALUES (21, 2, 'INV20251124144140-4967', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:40', '2025-11-24 21:41:40');
INSERT INTO `transaction_history` VALUES (22, 2, 'INV20251124144141-2525', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:41', '2025-11-24 21:41:41');
INSERT INTO `transaction_history` VALUES (23, 2, 'INV20251124144142-3095', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:42', '2025-11-24 21:41:42');
INSERT INTO `transaction_history` VALUES (24, 2, 'INV20251124144142-6404', 'VOUCHER_GAME', 'Pembayaran Voucher Game', 100000, '2025-11-24 21:41:42', '2025-11-24 21:41:42');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profile_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'user@gmail.com', 'Riski', 'Ramadhan', '$2b$10$ocwz.Vfy.6ZfXMmoOzTeA.mVLkT1joTq1s7EV2/RBLPsVav6E2zOW', '', '2025-11-24 19:12:11', NULL);
INSERT INTO `users` VALUES (2, 'user@nutech-integrasi.com', 'User Edited', 'Nutech Edited', '$2b$10$77Rzf5iBKGOcNe5mEvj3duZnqqUIn0.iow6x6sTpVCakbMd1f4cVG', 'profile_2.jpg', '2025-11-24 20:00:07', NULL);

SET FOREIGN_KEY_CHECKS = 1;
