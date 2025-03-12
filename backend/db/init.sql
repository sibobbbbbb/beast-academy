CREATE TYPE user_role as ENUM ('admin','trainer','member');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role user_role,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE members (
    id INT PRIMARY KEY,
    img_url TEXT NOT NULL DEFAULT '',
    phone_no VARCHAR(15) CHECK (phone_no ~ '^[0-9]+$') UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stat1 INT CHECK (stat1 BETWEEN 1 AND 100),
    stat2 INT CHECK (stat2 BETWEEN 1 AND 100),
    stat3 INT CHECK (stat3 BETWEEN 1 AND 100),
    stat4 INT CHECK (stat4 BETWEEN 1 AND 100),
    stat5 INT CHECK (stat5 BETWEEN 1 AND 100),

    FOREIGN KEY (id) REFERENCES users(id)
);



-- Inserting dummy users
INSERT INTO users (role, username, password) VALUES 
('admin', 'admin_user1', 'password123'),
('trainer', 'trainer_user1', 'password123'),
('member', 'member_user1', 'password123'),
('member', 'member_user2', 'password123'),
('member', 'member_user3', 'password123'),
('trainer', 'trainer_user2', 'password123'),
('admin', 'admin_user2', 'password123'),
('member', 'member_user4', 'password123'),
('member', 'member_user5', 'password123'),
('trainer', 'trainer_user3', 'password123');

-- Inserting dummy members (Linked to 'member' users above)
INSERT INTO members (id, phone_no, email, stat1, stat2, stat3, stat4, stat5) VALUES 
(3,'1234567890', 'member1@example.com', 85, 90, 78, 92, 81),
(4,'2345678901', 'member2@example.com', 77, 89, 94, 68, 73),
(5,'3456789012', 'member3@example.com', 90, 85, 88, 79, 82),
(8,'4567890123', 'member4@example.com', 76, 84, 81, 88, 90),
(9,'5678901234', 'member5@example.com', 83, 78, 91, 86, 79);
