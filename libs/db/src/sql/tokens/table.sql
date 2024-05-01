CREATE TABLE tokens
(
    token_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    token_position SERIAL,
    user_id uuid NOT NULL REFERENCES users(user_id),
    token_expires timestamptz DEFAULT NOW() + interval '30 days',
    token_cookie text NOT NULL,
    token_created_at timestamptz NOT NULL DEFAULT NOW(),
    token_updated_at timestamptz NOT NULL DEFAULT NOW(),
    token_identity JSONB
)