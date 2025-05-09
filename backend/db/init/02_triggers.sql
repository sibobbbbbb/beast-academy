-- Create a function to update user_activity_score when users log in
CREATE OR REPLACE FUNCTION update_user_login_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Create activity score record if it doesn't exist
  INSERT INTO user_activity_score (user_id, days_since_last_login, last_calculated)
  VALUES (NEW.id, 0, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    days_since_last_login = EXTRACT(DAY FROM (NOW() - NEW.last_activity)),
    last_calculated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update activity score when users log in
CREATE TRIGGER user_login_trigger
AFTER UPDATE OF last_activity ON users
FOR EACH ROW
WHEN (OLD.last_activity IS DISTINCT FROM NEW.last_activity)
EXECUTE FUNCTION update_user_login_activity();

-- LOGIN FUNC

-- Create a function to update user login activity
CREATE OR REPLACE FUNCTION update_user_login(user_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update the last_activity timestamp
  UPDATE users 
  SET last_activity = NOW() 
  WHERE id = user_id;
  
  -- Create or update the activity score
  INSERT INTO user_activity_score (user_id, days_since_last_login, last_calculated)
  VALUES (user_id, 0, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    days_since_last_login = 0, -- User just logged in, so it's 0 days
    last_calculated = NOW();
    
  -- Return success
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;


-- Create a function to add new user_activity
CREATE OR REPLACE FUNCTION create_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Create activity score record if it doesn't exist
  INSERT INTO user_activity_score (user_id, last_calculated)
  VALUES (NEW.id, NOW())
  ON CONFLICT (user_id) 
  DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update activity score when users log in
CREATE TRIGGER new_user_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_activity();
