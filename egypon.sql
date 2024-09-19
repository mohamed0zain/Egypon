-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2024 at 03:57 AM
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
-- Database: `egypon`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `created_at`, `updated_at`) VALUES
(2, 'New Brand Nam1e', '2024-09-17 18:16:33', '2024-09-17 19:34:38'),
(3, 'BrandName', '2024-09-17 20:35:36', '2024-09-17 20:35:36');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_quantity` int(11) DEFAULT 0,
  `total_price` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at`, `total_quantity`, `total_price`) VALUES
(11, 10, 5, 2, '2024-09-18 21:17:54', '2024-09-18 21:48:58', 4, 1059.98),
(13, 10, 3, 2, '2024-09-18 21:47:18', '2024-09-18 21:48:58', 4, 1059.98);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(2, 'Electronics', '2024-09-17 20:35:38', '2024-09-17 20:35:38');

-- --------------------------------------------------------

--
-- Table structure for table `company_users`
--

CREATE TABLE `company_users` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_mobile_phone` varchar(20) NOT NULL,
  `company_land_number` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `commercial_register_number` varchar(255) NOT NULL,
  `tax_card_number` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `account_status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `address` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_users`
--

INSERT INTO `company_users` (`id`, `company_name`, `company_mobile_phone`, `company_land_number`, `email`, `password`, `token`, `commercial_register_number`, `tax_card_number`, `created_at`, `updated_at`, `account_status`, `address`, `country`, `city`, `is_verified`) VALUES
(1, 'Elfahd electronics', '02335252', '4454545', 'mohamedzain235@gmail.com', '$2b$10$IFuJ3sfPsphXSPC9ESZJYeN3CgbmwJ/4yiVwO/pGHLTxgEH4dcUJG', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaGFtZWR6YWluMjM1QGdtYWlsLmNvbSIsInR5cGUiOiJjb21wYW55X3VzZXIiLCJpYXQiOjE3MjI5NTAyMDIsImV4cCI6MTcyMjk1MzgwMn0.SeAV_Ar-lYsztrtINl_Ml3PMqJ5EeZrwmGJvfe2CmEU', '123', '15', '2024-08-06 16:16:42', '2024-08-06 16:16:42', 'pending', '283H', 'Egypt', 'giza', 0),
(2, 'mohamed', '15', '16', 'mohamedzain@gmail.com', '$2b$10$O2pElOUayy.ESAXZataCmewff8YOBnQ/zIU1Ye3CfJAtXIZmQ25qO', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJtb2hhbWVkemFpbkBnbWFpbC5jb20iLCJ0eXBlIjoiY29tcGFueV91c2VyIiwiaWF0IjoxNzIzNjY4NjU2LCJleHAiOjE3MjM2NzIyNTZ9.OT90k-vmG0A0PbHwAKzTYqZdLr_VS5b_9Q5_XMuJX2o', '01005615476', '12345678', '2024-08-14 23:42:58', '2024-08-14 23:50:56', 'pending', '02333902326', '283H', 'giza', 0),
(3, 'Egypon Solutions', '0123456789', '0223456789', 'info@egypon.com', '$2b$10$irqiw/YX5DjN5TZKNJkVje0rH6gAZ3ueNIrR/rT/5q9lKOFLAbLTC', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZm9AZWd5cG9uLmNvbSIsInR5cGUiOiJjb21wYW55IiwiaWF0IjoxNzI1OTExMDgzLCJleHAiOjE3MjU5MTQ2ODN9.jIPOw7riCcY-pNpDQD9608JPoHlF9fIXMc9jR2Ff1fA', '123456789012345', '987654321012345', '2024-09-09 22:44:43', '2024-09-09 22:44:43', 'pending', '123 Business Street, Industrial Area', 'Egypt', 'Cairo', 0),
(4, 'Egypon Solutions', '0123456789', '0223456789', 'inf11o@egypon.com', '$2b$10$cX2ws1nYYItggvtMI9ElH.Z68UClQd1laLI9YjvVDbuZoRqM8NGvK', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZjExb0BlZ3lwb24uY29tIiwidHlwZSI6ImNvbXBhbnkiLCJpYXQiOjE3MjU5MTEyMTIsImV4cCI6MTcyNTkxNDgxMn0.ZUrI0G8nrdf334cGzIbtavgY2VxBxxbMOIzZSBPYbck', '12434567812345', '987653221012345', '2024-09-09 22:46:52', '2024-09-09 22:46:52', 'pending', '123 Business Street, Industrial Area', 'Egypt', 'Cairo', 0),
(5, 'Tech Innovations', '1234567890', '0987654321', 'contact@techinnovations.com', '$2b$10$5JuT4dpGdqTCSypjaS/AXOKV6mU8Cr10dmQOtyhFvPYLHQj2Ao2pa', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvbnRhY3RAdGVjaGlubm92YXRpb25zLmNvbSIsInR5cGUiOiJjb21wYW55IiwiaWF0IjoxNzI2NTA0MTAxLCJleHAiOjE3MjY1MDc3MDF9.pXw18zKkKx0JRSamYLRrHh20HY92KtpkWrwnq2EtUFw', '123452323689045', '543210987654321', '2024-09-16 19:28:21', '2024-09-16 19:28:21', 'pending', '123 Tech Lane', 'Techland', 'Techville', 0);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `line_number` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `first_name`, `last_name`, `display_name`, `gender`, `email`, `mobile_number`, `line_number`, `address`, `country`, `city`, `password`, `token`, `created_at`, `updated_at`, `is_verified`) VALUES
(2, 'mohamed', 'zain', 'mohamed eltaher', 'Male', 'mohamedzain23@gmail.com', '01005615476', '02333902326', '283H', 'Egypt', 'giza', '$2b$10$O4sm5YoodKrr/eNus6LwxO.COqk1W8kkmWep1nS5rRzJi8ys0w.tq', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJtb2hhbWVkemFpbjIzQGdtYWlsLmNvbSIsInR5cGUiOiJjdXN0b21lciIsImlhdCI6MTcyMzY2ODQyOCwiZXhwIjoxNzIzNjcyMDI4fQ._FZFx2boXvg7AcKeDXSo_fNC97owNugqu4a8Go4vnFo', '2024-08-14 23:38:40', '2024-08-14 23:47:08', 0),
(3, 'mohamed', 'zain', 'mohamed eltaher', 'Male', 'mohamedza@gmail.com', '01005615476', '02333902326', '283H', 'Egypt', 'giza', '$2b$10$6VSh9dsVgS4aNWdvNRMIz.LhowPr67EGLxqDW3TRFH5CjyTKSZ7su', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaGFtZWR6YUBnbWFpbC5jb20iLCJ0eXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MjQxMDY4MDYsImV4cCI6MTcyNDExMDQwNn0.W031K-QOde7S5qU9SVGdM5y1gC3GDFF0-otpHoZzbZ4', '2024-08-20 01:33:26', '2024-08-20 01:33:26', 0),
(15, 'Hazem', 'Hamdy', 'Hazem', 'Male', 'Hazem_hamdy2adf35@gmail.com', '0115531277405', '23339023261', '2833H', 'Egypt', 'giza', '$2b$10$oWbm7iza5BqfsVAHZ6kkNeSJ2hys1JbLKUfv0dwQW.R6PCLkhGOhy', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkhhemVtX2hhbWR5MmFkZjM1QGdtYWlsLmNvbSIsInR5cGUiOiJjdXN0b21lciIsImlhdCI6MTcyNTkwNzU0NCwiZXhwIjoxNzI1OTExMTQ0fQ.JXKpDC84IPa47Vo1ZYipVkxxeKFITNN41X2Yhev_x-4', '2024-09-09 21:45:44', '2024-09-09 21:45:44', 0),
(16, 'Hazem', 'Hamdy', 'Hazem', 'Male', 'Hazem_hamdy2addf35@gmail.com', '0115531277405', '23339023261', '2833H', 'Egypt', 'giza', '$2b$10$Ry.avyQcshPDZ96hYeyyLeTprjRIOupaMPFfyCFBK72FiP5m4GoBK', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkhhemVtX2hhbWR5MmFkZGYzNUBnbWFpbC5jb20iLCJ0eXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MjU5MDk3MTIsImV4cCI6MTcyNTkxMzMxMn0._ghwpvCR3DtTw8IZske5aIp5z-DuWb55RmTC-kMsm6c', '2024-09-09 22:21:52', '2024-09-09 22:21:52', 0),
(17, 'Hazem', 'Hamdy', 'Hazem', 'Male', 'Hazem_hamdy2dddf35@gmail.com', '0115531277405', '23339023261', '2833H', 'Egypt', 'giza', '$2b$10$U.HbqQnl2d5sjz/S/cmou.63NyF8.JoP1GOJTLY1FiJ1FfE0WQKLa', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkhhemVtX2hhbWR5MmRkZGYzNUBnbWFpbC5jb20iLCJ0eXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MjU5MDk3MjIsImV4cCI6MTcyNTkxMzMyMn0.3d4vqMBoEqOOEFDvpIRuw0laV_Q22o_XzywAIylJ_yk', '2024-09-09 22:22:02', '2024-09-09 22:22:02', 0);

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `shipping_address` text DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `status` enum('Pending','Shipped','Delivered','Canceled') DEFAULT 'Pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productimages`
--

CREATE TABLE `productimages` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(5,2) DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `main_image` varchar(255) DEFAULT NULL,
  `product_condition` enum('new','used') DEFAULT 'new'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `brand_id`, `category_id`, `description`, `price`, `discount`, `created_at`, `updated_at`, `main_image`, `product_condition`) VALUES
(2, 'Example Product', 2, 2, 'This is an example description for the product.', 29.99, 0.00, '2024-09-17 20:36:00', '2024-09-17 20:36:00', NULL, 'new'),
(3, 'Example Product', 2, 2, 'This is an example description for the product.', 29.99, 0.00, '2024-09-17 20:36:01', '2024-09-17 20:36:01', NULL, 'new'),
(4, 'Example Product1', 2, 2, 'This is an example product description.', 199.99, 10.00, '2024-09-17 21:43:21', '2024-09-17 21:43:21', NULL, 'new'),
(5, 'lol', 2, 2, 'product descriptoin', 500.00, 4.00, '2024-09-18 01:22:50', '2024-09-19 04:43:28', '1726710208613-511476393.jpeg', 'used'),
(6, 'product name1134', 2, 2, 'product descriptoin', 500.00, 22.00, '2024-09-18 01:30:14', '2024-09-18 01:30:14', '????\0JFIF\0\0\0\0\0\0??\0C\0\n\n\n		\n\Z%\Z# , #&\')*)-0-(0%()(??\0C\n\n\n\n(\Z\Z((((((((((((((((((((((((((((((((((((((((((((((((((??\0??\"\0??\0\0\0\0\0\0\0\0\0\0\0\0\0??\0\0\0\0\0\0\0\0\0\0\0\0??\0\0\0\0??\0\0\0\0\0', 'used'),
(7, 'product name11', 2, 2, 'product descriptoin', 500.00, 22.00, '2024-09-19 04:39:41', '2024-09-19 04:39:41', '1726709981458-277878892.jpg', 'used');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company_users`
--
ALTER TABLE `company_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `productimages`
--
ALTER TABLE `productimages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `company_users`
--
ALTER TABLE `company_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productimages`
--
ALTER TABLE `productimages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `company_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `company_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `productimages`
--
ALTER TABLE `productimages`
  ADD CONSTRAINT `productimages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
