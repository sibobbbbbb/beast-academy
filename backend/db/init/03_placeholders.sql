-- Memasukkan data users
INSERT INTO users (role, username, password, email, name, avatar, phone_no)
VALUES 
('trainer', 'trainer1', '$2b$10$NEKUb79F5Rey5EAvV4WHIu0/0CbeE73xMjSbDHHInXzdgX1bsarKm', 'trainer1@example.com', 'Trainer One', 'https://example.com/images/trainer1.jpg', '2222222222'),
('member', 'member1', '$2b$10$pe58/GdmZqKLjjAyWve0jOZlcYIVDvRTsjmmr9utGP1JKBJJDY5za', 'alice@example.com', 'Alice', 'https://example.com/images/alice.jpg', '1234567890'),
('member', 'member2', '$2b$10$Gu7rgZVnPpoP.6DZuRGR3OiyjNk4YsKqs7bVj3c0ui/mZJxdFg56W', 'bob@example.com', 'Bob', 'https://example.com/images/bob.jpg', '0987654321'),
('member', 'member3', '$2b$10$saAl1njiO7Ay8tIWTC4zoe2YBGH3VCoBgLXcs2w8Thj57.E/YWeTO', 'charlie@example.com', 'Charlie', 'https://example.com/images/charlie.jpg', '1122334455');

-- hashedpassword2
-- ...
-- hashedpassword5

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