CREATE TABLE users
(
    user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_position SERIAL, 
    user_username text NOT NULL UNIQUE,
    user_password text NOT NULL,
    user_email text NOT NULL UNIQUE,
    user_profile_picture text,
    user_stripe_customer_id text,
    user_first_name text,
    user_last_name text,
    user_created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)