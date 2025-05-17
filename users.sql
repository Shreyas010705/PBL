
use shreyas;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);




SELECT * FROM users WHERE email = 'user1@example.com' 
AND password = SHA2('password1', 256);