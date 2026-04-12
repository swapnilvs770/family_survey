-- Family Survey Database Setup Script
-- Execute this script to set up the database

-- Create database
CREATE DATABASE IF NOT EXISTS family_survey_db;
USE family_survey_db;

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  family_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,
  relation VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for better performance
  INDEX idx_family_id (family_id),
  INDEX idx_age (age),
  INDEX idx_gender (gender),
  INDEX idx_relation (relation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO family_members (family_id, name, age, gender, relation, dob) VALUES
-- Family 1: पाटील
(1, 'राजेश पाटील', 45, 'Male', 'प्रमुख', '1979-03-15'),
(1, 'सुनिता पाटील', 42, 'Female', 'पत्नी', '1982-07-22'),
(1, 'अनिकेत पाटील', 18, 'Male', 'मुलगा', '2006-11-10'),
(1, 'प्रिया पाटील', 15, 'Female', 'मुलगी', '2009-02-28'),
(1, 'आरव पाटील', 3, 'Male', 'नातू', '2021-05-18'),

-- Family 2: देशमुख
(2, 'संजय देशमुख', 52, 'Male', 'प्रमुख', '1972-09-05'),
(2, 'माधुरी देशमुख', 48, 'Female', 'पत्नी', '1976-12-15'),
(2, 'रोहन देशमुख', 22, 'Male', 'मुलगा', '2002-04-20'),
(2, 'नेहा देशमुख', 12, 'Female', 'मुलगी', '2012-08-30'),
(2, 'बाळकृष्ण देशमुख', 1, 'Male', 'नातू', '2023-01-12'),

-- Family 3: शिंदे
(3, 'विजय शिंदे', 38, 'Male', 'प्रमुख', '1986-06-18'),
(3, 'अनुराधा शिंदे', 35, 'Female', 'पत्नी', '1989-10-25'),
(3, 'साई शिंदे', 8, 'Female', 'मुलगी', '2016-03-14'),
(3, 'वेदांत शिंदे', 5, 'Male', 'मुलगा', '2019-07-08'),
(3, 'अद्विका शिंदे', 0, 'Female', 'मुलगी', '2024-02-20'),

-- Family 4: कांबळे
(4, 'प्रकाश कांबळे', 60, 'Male', 'प्रमुख', '1964-01-30'),
(4, 'सुमन कांबळे', 58, 'Female', 'पत्नी', '1966-05-12'),
(4, 'अमित कांबळे', 32, 'Male', 'मुलगा', '1992-11-08'),
(4, 'पूजा कांबळे', 28, 'Female', 'मुलगी', '1996-09-17'),
(4, 'आयुष कांबळे', 4, 'Male', 'नातू', '2020-12-05'),

-- Family 5: जाधव
(5, 'महेश जाधव', 41, 'Male', 'प्रमुख', '1983-08-22'),
(5, 'मंगल जाधव', 39, 'Female', 'पत्नी', '1985-02-14'),
(5, 'आद्या जाधव', 14, 'Female', 'मुलगी', '2010-06-30'),
(5, 'अर्जुन जाधव', 11, 'Male', 'मुलगा', '2013-10-19'),
(5, 'आराध्या जाधव', 2, 'Female', 'मुलगी', '2022-04-25');

-- Verify data
SELECT 'Database setup complete!' AS message;
SELECT COUNT(*) AS total_members FROM family_members;
SELECT COUNT(DISTINCT family_id) AS total_families FROM family_members;
