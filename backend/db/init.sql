-- Membuat type yang dibutuhkan
CREATE TYPE user_role as ENUM ('admin','trainer','member');

-- Membuat tabel users (struktur tetap sama)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role user_role NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255),  -- Make password nullable for social logins
    email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    provider VARCHAR(20),    -- 'google', 'facebook', etc.
    provider_id VARCHAR(100),-- ID from the provider
    avatar TEXT,             -- Profile picture URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(100),
    img_url TEXT NOT NULL DEFAULT '',
    phone_no VARCHAR(15) CHECK (phone_no ~ '^[0-9]+$') UNIQUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat tabel members dengan struktur baru
CREATE TABLE members (
    id_m SERIAL PRIMARY KEY,
    id_u INT NOT NULL UNIQUE,
    stat1 INT CHECK (stat1 BETWEEN 1 AND 100),
    stat2 INT CHECK (stat2 BETWEEN 1 AND 100),
    stat3 INT CHECK (stat3 BETWEEN 1 AND 100),
    stat4 INT CHECK (stat4 BETWEEN 1 AND 100),
    stat5 INT CHECK (stat5 BETWEEN 1 AND 100),
    FOREIGN KEY (id_u) REFERENCES users(id) ON DELETE CASCADE
);

-- Membuat tabel events
CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL DEFAULT 'Event Title',
    images TEXT NOT NULL DEFAULT '',
    description VARCHAR(200) DEFAULT 'Description here',
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    joinform TEXT DEFAULT 'https://example.com/join-form'
);

-- Membuat tabel liked_by
CREATE TABLE liked_by(
    id SERIAL PRIMARY KEY,
    u_id INT NOT NULL,
    e_id INT NOT NULL,
    FOREIGN KEY (u_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (e_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Memasukkan data users
INSERT INTO users (role, username, password, email, name, img_url, phone_no)
VALUES 
('admin', 'admin1', 'hashedpassword1', 'admin1@example.com', 'Admin One', 'https://example.com/images/admin1.jpg', '1111111111'),
('trainer', 'trainer1', 'hashedpassword2', 'trainer1@example.com', 'Trainer One', 'https://example.com/images/trainer1.jpg', '2222222222'),
('member', 'member1', 'hashedpassword3', 'alice@example.com', 'Alice', 'https://example.com/images/alice.jpg', '1234567890'),
('member', 'member2', 'hashedpassword4', 'bob@example.com', 'Bob', 'https://example.com/images/bob.jpg', '0987654321'),
('member', 'member3', 'hashedpassword5', 'charlie@example.com', 'Charlie', 'https://example.com/images/charlie.jpg', '1122334455');

-- Memasukkan user dengan social login
INSERT INTO users (role, username, password, email, provider, provider_id, avatar)
VALUES 
('member', 'Google User', NULL, 'google.user@example.com', 'google', '123456789', 'https://example.com/images/google-avatar.jpg');

-- Memasukkan data members
-- Langsung terhubung dengan users melalui id_u
INSERT INTO members (id_u, stat1, stat2, stat3, stat4, stat5)
VALUES 
(3, 80, 70, 90, 60, 85),  -- User 'member1' dengan id=3
(4, 75, 65, 80, 70, 90),  -- User 'member2' dengan id=4
(5, 85, 95, 70, 60, 80),  -- User 'member3' dengan id=5
(6, 90, 80, 85, 75, 95);  -- User 'Google User' dengan id=6

-- Memasukkan data events
INSERT INTO events (title, images, description)
VALUES
('Tennis Grand Slam', 'https://example.com/images/example.jpg', 'Witness the best tennis players battle for glory.'),
('Tennis Art Showcase', 'https://example.com/images/example.jpg', 'An exhibition of iconic tennis moments captured in art.'),
('Tennis Tech Conference', 'https://example.com/images/example.jpg', 'Exploring the latest technology in tennis training and analytics.'),
('Tennis Food Fair', 'https://example.com/images/example.jpg', 'Fuel up with athlete-focused nutrition and delicious dishes.'),
('Tennis Book Launch', 'https://example.com/images/example.jpg', 'Launching the latest biography of a tennis legend.');

-- Memasukkan event tambahan (default values)
INSERT INTO events DEFAULT VALUES;

-- Memasukkan data liked_by
INSERT INTO liked_by (u_id, e_id)
VALUES
(3, 1),
(4, 2),
(5, 3),
(6, 4),
(3, 5),
(4, 1),
(5, 2),
(6, 3);

-- Menampilkan contoh query join antara users dan members
-- Query ini akan menggantikan cara lama melalui member_user
SELECT 
    u.id, u.username, u.email, u.name,
    m.id_m, m.stat1, m.stat2, m.stat3, m.stat4, m.stat5
FROM 
    users u
JOIN 
    members m ON u.id = m.id_u
WHERE 
    u.role = 'member';