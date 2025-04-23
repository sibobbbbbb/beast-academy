CREATE TYPE user_role as ENUM ('admin','trainer','member');

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

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    stat1 INT CHECK (stat1 BETWEEN 1 AND 100),
    stat2 INT CHECK (stat2 BETWEEN 1 AND 100),
    stat3 INT CHECK (stat3 BETWEEN 1 AND 100),
    stat4 INT CHECK (stat4 BETWEEN 1 AND 100),
    stat5 INT CHECK (stat5 BETWEEN 1 AND 100)
);

CREATE TABLE member_user(
    u_id INT NOT NULL,
    m_id INT NOT NULL,

    PRIMARY KEY (u_id, m_id),
    FOREIGN KEY (u_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (m_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL DEFAULT 'Event Title',
    images TEXT NOT NULL DEFAULT '',
    description VARCHAR(200) DEFAULT 'Description here',
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    joinform TEXT DEFAULT 'https://example.com/join-form'
);

CREATE TABLE liked_by(
    id SERIAL PRIMARY KEY,
    u_id INT NOT NULL,
    e_id INT NOT NULL
);

-- Insert dummy users
-- Insert dummy users (termasuk member details)
INSERT INTO users (role, username, password, email, name, img_url, phone_no)
VALUES 
('admin', 'admin1', 'hashedpassword1', 'admin1@example.com', 'Admin One', 'https://example.com/images/admin1.jpg', '1111111111'),
('trainer', 'trainer1', 'hashedpassword2', 'trainer1@example.com', 'Trainer One', 'https://example.com/images/trainer1.jpg', '2222222222'),
('member', 'member1', 'hashedpassword3', 'alice@example.com', 'Alice', 'https://example.com/images/alice.jpg', '1234567890'),
('member', 'member2', 'hashedpassword4', 'bob@example.com', 'Bob', 'https://example.com/images/bob.jpg', '0987654321'),
('member', 'member3', 'hashedpassword5', 'charlie@example.com', 'Charlie', 'https://example.com/images/charlie.jpg', '1122334455');

-- Insert a dummy social login user
INSERT INTO users (role, username, password, email, provider, provider_id, avatar)
VALUES 
('member', 'Google User', NULL, 'google.user@example.com', 'google', '123456789', 'https://example.com/images/google-avatar.jpg');

-- Insert dummy members
INSERT INTO members (stat1, stat2, stat3, stat4, stat5)
VALUES 
(80, 70, 90, 60, 85),
(75, 65, 80, 70, 90),
(85, 95, 70, 60, 80),
(90, 80, 85, 75, 95);
-- Insert dummy member_user relationships
-- Let's assume users with 'member' role are linked to members
INSERT INTO member_user (u_id, m_id)
VALUES
(3, 1),
(4, 2),
(5, 3),
(6, 4);

INSERT INTO events (title, images, description)
VALUES
('Tennis Grand Slam', 'https://example.com/images/example.jpg', 'Witness the best tennis players battle for glory.'),
('Tennis Art Showcase', 'https://example.com/images/example.jpg', 'An exhibition of iconic tennis moments captured in art.'),
('Tennis Tech Conference', 'https://example.com/images/example.jpg', 'Exploring the latest technology in tennis training and analytics.'),
('Tennis Food Fair', 'https://example.com/images/example.jpg', 'Fuel up with athlete-focused nutrition and delicious dishes.'),
('Tennis Book Launch', 'https://example.com/images/example.jpg', 'Launching the latest biography of a tennis legend.');

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


INSERT INTO events DEFAULT VALUES;
