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
    avatar TEXT NOT NULL,             -- Profile picture URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(100) NOT NULL ,
    phone_no VARCHAR(15) CHECK (phone_no ~ '^[0-9]+$') UNIQUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE trained_by(
    trainer_id INT NOT NULL,
    member_id INT NOT NULL,
    stat1 INT CHECK (stat1 BETWEEN 1 AND 100),
    stat2 INT CHECK (stat2 BETWEEN 1 AND 100),
    stat3 INT CHECK (stat3 BETWEEN 1 AND 100),
    stat4 INT CHECK (stat4 BETWEEN 1 AND 100),
    stat5 INT CHECK (stat5 BETWEEN 1 AND 100),
    PRIMARY KEY (trainer_id, member_id),
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE training_assignments (
    id SERIAL PRIMARY KEY,
    trainer_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES users(id),
    FOREIGN KEY (member_id) REFERENCES users(id)
);

-- Memasukkan data users
INSERT INTO users (role, username, password, email, name, avatar, phone_no)
VALUES 
('trainer', 'trainer1', 'hashedpassword2', 'trainer1@example.com', 'Trainer One', 'https://example.com/images/trainer1.jpg', '2222222222'),
('member', 'member1', 'hashedpassword3', 'alice@example.com', 'Alice', 'https://example.com/images/alice.jpg', '1234567890'),
('member', 'member2', 'hashedpassword4', 'bob@example.com', 'Bob', 'https://example.com/images/bob.jpg', '0987654321'),
('member', 'member3', 'hashedpassword5', 'charlie@example.com', 'Charlie', 'https://example.com/images/charlie.jpg', '1122334455');



-- Memasukkan data events
INSERT INTO events (title, images, description)
VALUES
('Tennis Grand Slam', 'https://placehold.co/600x400?text=Event+Image&font=roboto', 'Witness the best tennis players battle for glory.'),
('Tennis Art Showcase', 'https://placehold.co/600x400?text=Event+Image&font=roboto', 'An exhibition of iconic tennis moments captured in art.'),
('Tennis Tech Conference', 'https://placehold.co/600x400?text=Event+Image&font=roboto', 'Exploring the latest technology in tennis training and analytics.'),
('Tennis Food Fair', 'https://placehold.co/600x400?text=Event+Image&font=roboto', 'Fuel up with athlete-focused nutrition and delicious dishes.'),
('Tennis Book Launch', 'https://placehold.co/600x400?text=Event+Image&font=roboto', 'Launching the latest biography of a tennis legend.');

-- Memasukkan event tambahan (default values)
INSERT INTO events DEFAULT VALUES;