CREATE TABLE memberships
(
    membership_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_position SERIAL,
    group_id uuid NOT NULL REFERENCES groups(group_id),
    user_id uuid NOT NULL REFERENCES users(user_id),
    membership_status TEXT NOT NULL,
    membership_role TEXT NOT NULL,
    membership_created_at TIMESTAMPTZ DEFAULT now(),
    membership_updated_at TIMESTAMPTZ DEFAULT now()
)

CREATE UNIQUE INDEX memberships_group_id_user_id_index ON memberships (group_id, user_id);