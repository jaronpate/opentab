CREATE TABLE groups
(
    group_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_position SERIAL,
    group_name TEXT NOT NULL,
    group_description TEXT,
    group_color TEXT,
    group_icon TEXT,
    group_created_at TIMESTAMPTZ DEFAULT now(),
    group_updated_at TIMESTAMPTZ DEFAULT now()
)