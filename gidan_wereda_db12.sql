-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 04, 2026 at 11:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gidan_wereda_db12`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `service_type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tracking_code` varchar(50) DEFAULT NULL,
  `admin_reply` text DEFAULT NULL,
  `messages` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `full_name`, `phone`, `service_type`, `description`, `status`, `created_at`, `tracking_code`, `admin_reply`, `messages`) VALUES
(1, 'fjhkjlk', '0987654321', 'Clearance / Certificate', 'awsedrftyg', 'Pending', '2026-09-03 02:35:56', 'GIDAN-970264', NULL, '[{\"sender\":\"admin\",\"text\":\"hi\",\"timestamp\":\"2026-09-03T02:36:31.033Z\"},{\"sender\":\"user\",\"text\":\"hi\",\"timestamp\":\"2026-09-03T02:36:53.795Z\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `messages` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `message`, `created_at`, `messages`) VALUES
(1, 'Girma Mengistu', 'girmamengex@gmail.com', 'df', '2026-09-03 03:11:24', '[{\"sender\":\"user\",\"text\":\"df\",\"timestamp\":\"2026-09-03T03:11:24.084Z\"}]'),
(2, 'Girma Mengistu', 'girmamengex@gmail.com', 'awsedrftyg', '2026-09-03 05:46:17', '[{\"sender\":\"user\",\"text\":\"awsedrftyg\",\"timestamp\":\"2026-09-03T05:46:17.389Z\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `focal_supervisor_chats`
--

CREATE TABLE `focal_supervisor_chats` (
  `id` int(11) NOT NULL,
  `focal_name` varchar(100) NOT NULL,
  `sender_type` enum('supervisor','focal') NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `focal_supervisor_chats`
--

INSERT INTO `focal_supervisor_chats` (`id`, `focal_name`, `sender_type`, `message`, `created_at`) VALUES
(1, 'Communication Pool Focal (Comm Focal)', 'supervisor', 'hi', '2026-09-04 11:19:24'),
(2, 'Communication Pool Focal (Comm Focal)', 'supervisor', 'hi', '2026-09-04 11:19:51'),
(3, 'Communication Pool Focal (Comm Focal)', 'supervisor', 'hi', '2026-09-04 16:09:18'),
(4, 'Communication Pool Focal (Comm Focal)', 'supervisor', 'hi', '2026-09-04 16:30:18'),
(5, 'You (Focal)', 'focal', 'hi', '2026-09-04 16:31:23'),
(6, 'Communication Pool Focal (Comm Focal)', 'supervisor', 'endet nek', '2026-09-04 16:31:45'),
(7, 'You (Focal)', 'focal', 'alehulh,antes', '2026-09-04 16:32:09'),
(8, 'Administration Pool Focal (Admin Focal)', 'supervisor', 'hi', '2026-09-04 19:08:53'),
(9, 'You (Focal)', 'focal', 'hi', '2026-09-04 19:09:22');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `author`, `created_at`) VALUES
(1, 'wsedrft', 'aqsdefygtfrdeswaqedrft', 'ዋና አስተዳዳሪ (Admin)', '2026-09-03 02:23:53');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pool_name` varchar(100) NOT NULL DEFAULT 'Administration'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `name`, `position`, `department`, `phone`, `status`, `created_at`, `pool_name`) VALUES
(1, 'አበበ ከበደ', 'HR Officer', 'sport', '', 'available', '2026-09-03 02:42:57', 'Administration');

-- --------------------------------------------------------

--
-- Table structure for table `staff_attendance`
--

CREATE TABLE `staff_attendance` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `check_in_time` time DEFAULT NULL,
  `status` enum('Present','Absent','Late') DEFAULT 'Present',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supervisor_reports`
--

CREATE TABLE `supervisor_reports` (
  `id` int(11) NOT NULL,
  `focal_name` varchar(150) NOT NULL,
  `report_title` varchar(255) NOT NULL,
  `report_month` varchar(50) NOT NULL,
  `report_content` text NOT NULL,
  `report_type` varchar(50) DEFAULT 'weekly',
  `pool_name` varchar(100) DEFAULT 'Communication Pool',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `attendance_data` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supervisor_reports`
--

INSERT INTO `supervisor_reports` (`id`, `focal_name`, `report_title`, `report_month`, `report_content`, `report_type`, `pool_name`, `created_at`, `attendance_data`) VALUES
(1, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 04:20:28', ''),
(2, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 04:21:52', ''),
(3, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 04:23:00', ''),
(4, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 04:48:40', ''),
(5, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 05:11:01', ''),
(6, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 05:31:48', ''),
(7, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 05:57:55', ''),
(8, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:04:21', ''),
(9, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:06:03', ''),
(10, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:07:51', ''),
(11, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:10:47', ''),
(12, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:19:03', ''),
(13, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:19:13', ''),
(14, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:21:16', ''),
(15, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:21:25', ''),
(16, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:22:16', ''),
(17, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:22:39', ''),
(18, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:37:50', ''),
(19, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 06:39:40', ''),
(20, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 16:48:36', ''),
(21, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 16:49:19', ''),
(22, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 16:58:29', ''),
(23, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 17:09:09', ''),
(24, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 17:30:03', ''),
(25, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 17:30:25', ''),
(26, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 17:35:49', ''),
(27, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 17:42:39', ''),
(28, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 18:50:35', ''),
(29, 'comm_focal', 'Weekly Report', 'May', 'የተጠቃለለ የ May ወር ሳምንታዊ ሪፖርት (Weekly Attendance Report) ከዕለታዊ መዝገቦች ተሰልፎ ተልኳል።', 'weekly', 'Communication Pool', '2026-09-04 20:16:18', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  `pool_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `pool_name`, `created_at`) VALUES
(1, 'comm_focal', 'comm123', 'pool_focal', 'Communication Pool', '2026-09-03 02:56:29'),
(2, 'admin_focal', 'admin123', 'pool_focal', 'Administration Pool', '2026-09-03 02:56:29'),
(3, 'civil_focal', 'civil123', 'pool_focal', 'Civil Service Pool', '2026-09-03 02:56:29'),
(4, 'admin', 'admin123', 'admin', NULL, '2026-09-03 02:56:29'),
(5, 'ict_user', 'ict123', 'ict', NULL, '2026-09-03 02:57:46'),
(6, 'staff_user', 'staff123', 'staff', NULL, '2026-09-03 02:57:46'),
(7, 'supervisor', '123456', 'supervisor', NULL, '2026-09-03 02:59:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `focal_supervisor_chats`
--
ALTER TABLE `focal_supervisor_chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_attendance`
--
ALTER TABLE `staff_attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `supervisor_reports`
--
ALTER TABLE `supervisor_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `focal_supervisor_chats`
--
ALTER TABLE `focal_supervisor_chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `staff_attendance`
--
ALTER TABLE `staff_attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supervisor_reports`
--
ALTER TABLE `supervisor_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `staff_attendance`
--
ALTER TABLE `staff_attendance`
  ADD CONSTRAINT `staff_attendance_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
