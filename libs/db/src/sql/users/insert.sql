INSERT INTO users(user_username, user_password, user_email, user_first_name, user_last_name)
VALUES(${username}, ${password}, ${email}, ${first_name}, ${last_name})
RETURNING *