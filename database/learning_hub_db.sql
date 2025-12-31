CREATE DATABASE  IF NOT EXISTS `learning_hub_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `learning_hub_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: learning_hub_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,1,'Created Account','Created user: prof_it (professor)','2025-12-31 01:51:15','2025-12-31 01:51:15'),(2,1,'Created Account','Created user: prof_bio (professor)','2025-12-31 01:51:34','2025-12-31 01:51:34'),(3,1,'Created Account','Created user: student1 (student)','2025-12-31 03:40:50','2025-12-31 03:40:50');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme_color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#3182ce',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'BS Information Teachnology','Focuses on the study of computer systems and their applications, equipping students with the technical skills to develop software and manage network solutions.','courses/HQ7kOZYpgJDMUs9RMyRho082qG0hnug53jipIPMw.png','#3182ce','2025-12-31 01:49:30','2025-12-31 01:49:30'),(2,'BS Biology','Explores the fundamental principles of life, from molecular structures to complex ecosystems, preparing students for careers in medicine, research, and biotechnology.','courses/pQOZsXNWSmZxM7eY7IsemXzocpb5srQFYH1pOaZX.png','#3182ce','2025-12-31 01:50:50','2025-12-31 01:50:50'),(3,'BS Chemistry','Engages in the study of matter, its properties, and transformations. The program equips students with analytical and laboratory skills.','courses/9xT7bEEv8KTR2tkV4eLgaWvB7R7HcZInYBiy9cuj.png','#3182ce','2025-12-31 05:35:15','2025-12-31 05:35:15'),(4,'BS Mathematics','Focuses on abstract structures, patterns, and logical reasoning, equipping students with analytical tools for cryptography, data science, and complex problem-solving.','courses/5mTH7CfY91fuQDy0MJH7yAbtNZrg6m3DNKsk2uue.png','#3182ce','2025-12-31 08:20:58','2025-12-31 08:20:58');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lessons_subject_id_foreign` (`subject_id`),
  CONSTRAINT `lessons_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (1,1,'Programming Fundamentals','Module 1','lessons/PMoRPB9XOsUwk7YLDGbDMCY9jKTuwOHKrkIaxf2Z.pdf','document','2025-12-31 02:52:28','2025-12-31 02:52:28'),(2,2,'Introduction to Web Development and Review on the Fundamentals of HTML','Module 1','lessons/KmjaMfrawCjRS0HfehNqGZGRk3UYxABG78SyyEwV.pdf','document','2025-12-31 08:13:19','2025-12-31 08:13:19');
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_12_30_171210_create_personal_access_tokens_table',1),(5,'2025_12_30_171411_create_courses_table',1),(6,'2025_12_30_171411_create_subjects_table',1),(7,'2025_12_30_171413_create_activity_logs_table',1),(8,'2025_12_30_173856_create_notifications_table',1),(9,'2025_12_30_181202_create_lessons_table',1),(10,'2025_12_30_181202_create_quizzes_table',1),(11,'2025_12_30_181206_create_quiz_attempts_table',1),(12,'2025_12_30_184507_add_course_id_to_users_table',1),(13,'2025_12_30_190219_add_theme_color_to_courses_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_foreign` (`user_id`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,4,'New Content Uploaded','New Lesson: Introduction to Web Development and Review on the Fundamentals of HTML','lesson',0,'2025-12-31 08:13:19','2025-12-31 08:13:19');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','aea61765b9ed6b4e0d42eca082564f81a62a5b87e6a3381b12dcae435504d7f5','[\"*\"]','2025-12-31 03:49:55',NULL,'2025-12-31 01:48:42','2025-12-31 03:49:55'),(2,'App\\Models\\User',2,'auth_token','b2fea0b76a465f8450857b18f1f3501265c9be782f2b8c8ad2010d55fa0dcbf1','[\"*\"]','2025-12-31 03:24:33',NULL,'2025-12-31 01:52:18','2025-12-31 03:24:33'),(3,'App\\Models\\User',4,'auth_token','91941f3f3939bb76d8227539c8500b0796177b24c9434811c2314850da28dd5d','[\"*\"]','2025-12-31 03:41:54',NULL,'2025-12-31 03:41:04','2025-12-31 03:41:54'),(4,'App\\Models\\User',4,'auth_token','843cf99a2acfa4e8cb1c0f76f17e881c9e45b333a13491521e2ff58a43999415','[\"*\"]','2025-12-31 03:51:17',NULL,'2025-12-31 03:42:16','2025-12-31 03:51:17'),(5,'App\\Models\\User',4,'auth_token','b1bddb1929dbc9a7ac9de8966dc2452a4f8f95e5721eedcc0d11487f31627086','[\"*\"]','2025-12-31 04:04:16',NULL,'2025-12-31 03:52:47','2025-12-31 04:04:16'),(6,'App\\Models\\User',4,'student_token','eb84e6d882f495c0b87bb316be5069506c21fcfc3809c660f7218c7b39c41b9c','[\"*\"]',NULL,NULL,'2025-12-31 04:47:00','2025-12-31 04:47:00'),(7,'App\\Models\\User',4,'student_token','a30aaf1d27f35c77e416e314d38be7fb7f979d0019e5c48f1ba3cedf17f76668','[\"*\"]',NULL,NULL,'2025-12-31 05:03:50','2025-12-31 05:03:50'),(8,'App\\Models\\User',4,'student_token','8822f18fc33c2620e43ba2ac9910822154333b43618a6c6e0437e13e8f4c4166','[\"*\"]',NULL,NULL,'2025-12-31 05:09:06','2025-12-31 05:09:06'),(9,'App\\Models\\User',4,'student_token','8dbbd975015c2528faf294c0f4130fc8353d199461488dc3e67c76b636931b24','[\"*\"]',NULL,NULL,'2025-12-31 05:27:53','2025-12-31 05:27:53'),(10,'App\\Models\\User',4,'student_token','68c35ac4a7b68d0a3cc71d4c065ea69533ac1a16e1ce0f29c6424439132d452c','[\"*\"]',NULL,NULL,'2025-12-31 05:29:38','2025-12-31 05:29:38'),(11,'App\\Models\\User',1,'admin_token','2714d3b2d7b61ccfdc2461b886694f6db25f171087e1512e38680eb18af38bfe','[\"*\"]','2025-12-31 05:52:52',NULL,'2025-12-31 05:34:01','2025-12-31 05:52:52'),(12,'App\\Models\\User',4,'student_token','025c3d3f2112eca2bfda26510dec400817d47ad98d1d565084ea6e3711adf6b1','[\"*\"]','2025-12-31 06:05:18',NULL,'2025-12-31 05:40:47','2025-12-31 06:05:18'),(13,'App\\Models\\User',4,'student_token','4140fb85d5b55aea235edd02da8a6c9bcd5a6de17830f376bfb4efe4e33614da','[\"*\"]','2025-12-31 06:05:56',NULL,'2025-12-31 06:05:35','2025-12-31 06:05:56'),(14,'App\\Models\\User',4,'student_token','a2cf73b83f3254991dd39b32ce9a96c255a9ed7de4b422bcdf0ae32a7d48a2d0','[\"*\"]','2025-12-31 06:06:46',NULL,'2025-12-31 06:06:35','2025-12-31 06:06:46'),(15,'App\\Models\\User',4,'student_token','eb13f9970c94fb29ddf055468f1ab51311fde37e3df768f2230572ced4027fa6','[\"*\"]','2025-12-31 06:20:05',NULL,'2025-12-31 06:07:01','2025-12-31 06:20:05'),(16,'App\\Models\\User',4,'student_token','ed44c65dea145c4641dfab160187657d03e52f71e157b5af1ac80474a1dc82f7','[\"*\"]','2025-12-31 06:32:51',NULL,'2025-12-31 06:20:16','2025-12-31 06:32:51'),(17,'App\\Models\\User',2,'admin_token','02874016b4af4a7e7412aac257eee09e83f699c6580be47a1674f62d2499a243','[\"*\"]','2025-12-31 06:35:51',NULL,'2025-12-31 06:33:24','2025-12-31 06:35:51'),(18,'App\\Models\\User',4,'student_token','951963083999914a53097d60da51c1422865c9560664d5cb9d126c2196c88d42','[\"*\"]','2025-12-31 06:38:00',NULL,'2025-12-31 06:36:01','2025-12-31 06:38:00'),(19,'App\\Models\\User',2,'admin_token','e195b8f73b8128bc10630067603ee62be01aa97b9bd91d3441e52548d80a427d','[\"*\"]','2025-12-31 06:43:20',NULL,'2025-12-31 06:38:08','2025-12-31 06:43:20'),(20,'App\\Models\\User',4,'student_token','e4eeef041fa8d9c004dc6d310bb5648e8ae96b27e24afb1f30a6afb8d6e9721d','[\"*\"]','2025-12-31 06:44:08',NULL,'2025-12-31 06:43:29','2025-12-31 06:44:08'),(21,'App\\Models\\User',4,'student_token','113fe7b993a2d1768ea5235ff00643ae6a3001d0f52ccefe7e8aaaf8644494d2','[\"*\"]','2025-12-31 06:57:23',NULL,'2025-12-31 06:51:42','2025-12-31 06:57:23'),(22,'App\\Models\\User',4,'student_token','9edbfe68005a7bd721f26b98a2ba70075937ffade3b260be68a61021ffbc6784','[\"*\"]','2025-12-31 06:58:58',NULL,'2025-12-31 06:57:32','2025-12-31 06:58:58'),(23,'App\\Models\\User',4,'student_token','a113e98c0c0a3eb40e2958ab430d1f92742f4881c83f8c747de3f3f10e916352','[\"*\"]','2025-12-31 07:25:20',NULL,'2025-12-31 06:59:42','2025-12-31 07:25:20'),(24,'App\\Models\\User',2,'admin_token','7aa1bd08bb041d2f17b95fa8cdb38e191a2b7fdf0f2bc92e6de798930916b00e','[\"*\"]','2025-12-31 07:35:52',NULL,'2025-12-31 07:25:30','2025-12-31 07:35:52'),(25,'App\\Models\\User',2,'admin_token','b8120c73b7c2ca2081706551438108a27293b36b98924f26a36b2da07d7effb1','[\"*\"]','2025-12-31 07:40:56',NULL,'2025-12-31 07:35:58','2025-12-31 07:40:56'),(26,'App\\Models\\User',4,'student_token','3b346d57f892589a5dce9fa6fe14e21a1f2fec9aded1682eff1f7acffa21d90d','[\"*\"]','2025-12-31 07:53:27',NULL,'2025-12-31 07:51:16','2025-12-31 07:53:27'),(28,'App\\Models\\User',4,'student_token','73e54dfd116ba5cf0b75e5e8efdbcb9c84bbf0516a60f4e7dd36fe54461b73fd','[\"*\"]','2025-12-31 08:07:46',NULL,'2025-12-31 07:55:38','2025-12-31 08:07:46'),(29,'App\\Models\\User',1,'admin_token','ba9bd7d2e4a7bdbc38e543bcb0cde72ad549ce92e6150835360f519ae5c2f4d4','[\"*\"]','2025-12-31 08:07:39',NULL,'2025-12-31 07:58:17','2025-12-31 08:07:39'),(30,'App\\Models\\User',1,'admin_token','56640fb03f66fc7efb4be98de536b256d4983499c1f0e73ed38b0c341a7409be','[\"*\"]','2025-12-31 08:09:27',NULL,'2025-12-31 08:09:26','2025-12-31 08:09:27'),(31,'App\\Models\\User',2,'admin_token','b1f763fa47b595c3dd66f1fda09e9091da5cb1bb5d7c572a0dc386a657747900','[\"*\"]','2025-12-31 08:10:24',NULL,'2025-12-31 08:10:22','2025-12-31 08:10:24'),(32,'App\\Models\\User',2,'admin_token','ac06e14f52517026854fd850946194817e17f09dcb664ee2ab6ea95fa41e6e0f','[\"*\"]','2025-12-31 08:13:33',NULL,'2025-12-31 08:11:20','2025-12-31 08:13:33'),(33,'App\\Models\\User',4,'student_token','97d077d50c392d157f101d1c816bbfcdeedfc9b08e504e61ac2602a674ae245d','[\"*\"]','2025-12-31 08:15:56',NULL,'2025-12-31 08:13:49','2025-12-31 08:15:56');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_attempts`
--

DROP TABLE IF EXISTS `quiz_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_attempts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `student_answer` text COLLATE utf8mb4_unicode_ci,
  `score` int DEFAULT NULL,
  `ai_feedback` text COLLATE utf8mb4_unicode_ci,
  `ai_confidence` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_attempts_quiz_id_foreign` (`quiz_id`),
  KEY `quiz_attempts_student_id_foreign` (`student_id`),
  CONSTRAINT `quiz_attempts_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quiz_attempts_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_attempts`
--

LOCK TABLES `quiz_attempts` WRITE;
/*!40000 ALTER TABLE `quiz_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `essay_prompt` text COLLATE utf8mb4_unicode_ci,
  `is_ai_graded` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quizzes_subject_id_foreign` (`subject_id`),
  CONSTRAINT `quizzes_subject_id_foreign` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year_level` int NOT NULL,
  `semester` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subjects_code_unique` (`code`),
  KEY `subjects_course_id_foreign` (`course_id`),
  CONSTRAINT `subjects_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,1,'CC101','Computer Programming 1',1,1,'2025-12-31 01:49:44','2025-12-31 01:49:44'),(2,1,'WS101','Web System and Technologies',3,1,'2025-12-31 05:52:37','2025-12-31 05:52:37');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','professor','student') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `must_change_password` tinyint(1) NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `course_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_course_id_foreign` (`course_id`),
  CONSTRAINT `users_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@uep.edu.ph',NULL,'$2y$12$GV1zGTscAysYc96ZrEZ/AuIwaJ/B4lbpVbV1VBFv0AtlXXEaIhCpi',NULL,'admin',0,NULL,'2025-12-31 01:48:00','2025-12-31 01:48:00',NULL),(2,'prof_it','prof_it@uep.edu.ph',NULL,'$2y$12$svt1PDc3p5vBHuKBhMnF1OwnsWDhPcVrqRtDdjfyI/GrLpWqcwiIu',NULL,'professor',1,NULL,'2025-12-31 01:51:15','2025-12-31 01:51:15',1),(3,'prof_bio','prof_bio@uep.edu.ph',NULL,'$2y$12$LOcCi0jhGdB02qXwWub5w.qTDys4i96WuohS7pQJFQGzQNVGjfB7G',NULL,'professor',1,NULL,'2025-12-31 01:51:34','2025-12-31 01:51:34',2),(4,'student1','student1@uep.edu.ph',NULL,'$2y$12$IoMAkPxY0gOjpZxLG3yHnOm58izZrIWdk53hPQMgAqgikbyF1X2ee',NULL,'student',1,NULL,'2025-12-31 03:40:50','2025-12-31 03:40:50',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-01  0:34:45
