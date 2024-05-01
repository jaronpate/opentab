INSERT INTO tokens(user_id, token_expires, token_cookie, token_identity)
VALUES(${user_id}, ${expires}, ${cookie}, ${identity})
RETURNING *