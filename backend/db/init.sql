CREATE TYPE user_role as ENUM ('admin','trainer','member');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role user_role NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255),  -- Make password nullable for social logins
    email VARCHAR(100) UNIQUE NOT NULL,
    provider VARCHAR(20),    -- 'google', 'facebook', etc.
    provider_id VARCHAR(100),-- ID from the provider
    avatar TEXT,             -- Profile picture URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    img_url TEXT NOT NULL DEFAULT '',
    phone_no VARCHAR(15) CHECK (phone_no ~ '^[0-9]+$') UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE liked_by(
    u_id INT NOT NULL,
    e_id INT NOT NULL,

    FOREIGN KEY (u_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (e_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Insert dummy users
INSERT INTO users (role, username, password, email)
VALUES 
('admin', 'admin1', 'hashedpassword1', 'admin1@example.com'),
('trainer', 'trainer1', 'hashedpassword2', 'trainer1@example.com'),
('member', 'member1', 'hashedpassword3', 'member1@example.com'),
('member', 'member2', 'hashedpassword4', 'member2@example.com'),
('member', 'member3', 'hashedpassword5', 'member3@example.com');

-- Insert a dummy social login user
INSERT INTO users (role, username, password, email, provider, provider_id, avatar)
VALUES 
('member', 'Google User', NULL, 'google.user@example.com', 'google', '123456789', 'https://example.com/images/google-avatar.jpg');

-- Insert dummy members
INSERT INTO members (name, img_url, phone_no, email, stat1, stat2, stat3, stat4, stat5)
VALUES 
('Alice', 'https://example.com/images/alice.jpg', '1234567890', 'alice@example.com', 80, 70, 90, 60, 85),
('Bob', 'https://example.com/images/bob.jpg', '0987654321', 'bob@example.com', 75, 65, 80, 70, 90),
('Charlie', 'https://example.com/images/charlie.jpg', '1122334455', 'charlie@example.com', 85, 95, 70, 60, 80),
('Dave', 'https://example.com/images/dave.jpg', '2233445566', 'dave@example.com', 90, 85, 75, 80, 95),
('Eve', 'https://example.com/images/eve.jpg', '3344556677', 'eve@example.com', 65, 75, 85, 90, 70),
('Frank', 'https://example.com/images/frank.jpg', '4455667788', 'frank@example.com', 70, 80, 75, 85, 90),
('Grace', 'https://example.com/images/grace.jpg', '5566778899', 'grace@example.com', 95, 90, 85, 80, 75),
('Hank', 'https://example.com/images/hank.jpg', '6677889900', 'hank@example.com', 60, 70, 65, 75, 85),
('Ivy', 'https://example.com/images/ivy.jpg', '7788990011', 'ivy@example.com', 80, 90, 85, 95, 70),
('Jack', 'https://example.com/images/jack.jpg', '8899001122', 'jack@example.com', 85, 80, 75, 90, 95),
('Kate', 'https://example.com/images/kate.jpg', '9900112233', 'kate@example.com', 75, 85, 80, 70, 95),
('Leo', 'https://example.com/images/leo.jpg', '1122334456', 'leo@example.com', 90, 95, 85, 80, 75),
('Mia', 'https://example.com/images/mia.jpg', '2233445567', 'mia@example.com', 80, 70, 90, 60, 85),
('Nick', 'https://example.com/images/nick.jpg', '3344556678', 'nick@example.com', 75, 65, 80, 70, 90),
('Olivia', 'https://example.com/images/olivia.jpg', '4455667789', 'olivia@example.com', 85, 95, 70, 60, 80),
('Paul', 'https://example.com/images/paul.jpg', '5566778890', 'paul@example.com', 90, 85, 75, 80, 95),
('Quinn', 'https://example.com/images/quinn.jpg', '6677889901', 'quinn@example.com', 65, 75, 85, 90, 70),
('Rachel', 'https://example.com/images/rachel.jpg', '7788990012', 'rachel@example.com', 70, 80, 75, 85, 90),
('Steve', 'https://example.com/images/steve.jpg', '8899001123', 'steve@example.com', 95, 90, 85, 80, 75),
('Tina', 'https://example.com/images/tina.jpg', '9900112234', 'tina@example.com', 60, 70, 65, 75, 85),
('Uma', 'https://example.com/images/uma.jpg', '1122334457', 'uma@example.com', 80, 90, 85, 95, 70),
('Victor', 'https://example.com/images/victor.jpg', '2233445568', 'victor@example.com', 85, 80, 75, 90, 95),
('Wendy', 'https://example.com/images/wendy.jpg', '3344556679', 'wendy@example.com', 75, 85, 80, 70, 95),
('Xander', 'https://example.com/images/xander.jpg', '4455667780', 'xander@example.com', 90, 95, 85, 80, 75),
('Yasmine', 'https://example.com/images/yasmine.jpg', '5566778891', 'yasmine@example.com', 65, 75, 85, 90, 70);
-- Insert dummy member_user relationships
-- Let's assume users with 'member' role are linked to members
INSERT INTO member_user (u_id, m_id)
VALUES
(3, 1),
(4, 2),
(5, 3),
(6, 4); -- Link the social login user to a member

INSERT INTO events (title, images, description)
VALUES
('Tennis Grand Slam', 'https://example.com/images/example.jpg', 'Witness the best tennis players battle for glory.'),
('Tennis Art Showcase', 'https://example.com/images/example.jpg', 'An exhibition of iconic tennis moments captured in art.'),
('Tennis Tech Conference', 'https://example.com/images/example.jpg', 'Exploring the latest technology in tennis training and analytics.'),
('Tennis Food Fair', 'https://example.com/images/example.jpg', 'Fuel up with athlete-focused nutrition and delicious dishes.'),
('Tennis Book Launch', 'https://example.com/images/example.jpg', 'Launching the latest biography of a tennis legend.');

-- INSERT INTO liked_by (u_id, e_id)
-- VALUES
-- (3, 1),
-- (4, 2),
-- (5, 3),
-- (6, 4),
-- (3, 5),
-- (4, 1),
-- (5, 2),
-- (6, 3);


INSERT INTO events DEFAULT VALUES;
