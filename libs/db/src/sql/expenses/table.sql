CREATE TABLE expenses
(
    expense_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_position SERIAL,
    group_id uuid NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
    payee_id uuid NOT NULL REFERENCES users(user_id),
    payer_ids uuid[] NOT NULL,
    expense_date TIMESTAMPTZ NOT NULL,
    expense_name TEXT NOT NULL,
    expense_description TEXT,
    expense_notes TEXT,
    expense_split JSONB NOT NULL,
    expense_line_items JSONB NOT NULL DEFAULT '[]',
    expense_subtotal double precision NOT NULL,
    expense_tax double precision NOT NULL,
    expense_created_at TIMESTAMPTZ DEFAULT now(),
    expense_updated_at TIMESTAMPTZ DEFAULT now()
)