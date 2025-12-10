CREATE DATABASE IF NOT EXISTS `matepiee-website-db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE `matepiee-website-db`

CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rights INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email_address, password, rights)
VALUES
('matepiee', 'matepiee@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$/mEs6pV7SvWK+U3yLaclpA$4LHME0nKa93IlPMlDhT0qlGpCbobY+YEfEax6EtdS8M', 1);