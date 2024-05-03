export type UUID = string;

// Auth Models

export class User {
    id: UUID;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    stripe_customer_id?: string;
    token?: Token;

    constructor(data: User) {
        this.id = data.id;
        this.email = data.email;
        this.password = data.password;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.profile_picture = data.profile_picture;
        this.stripe_customer_id = data.stripe_customer_id;
        this.token = data.token;
    }

    public static init(data: any) {
        return new User(data);
    }

    public static fromDB(data: any) {
        return User.init({
            id: data.user_id,
            email: data.user_email,
            password: data.user_password,
            first_name: data.user_first_name,
            last_name: data.user_last_name,
            profile_picture: data.user_profile_picture,
            stripe_customer_id: data.user_stripe_customer_id,
        });
    }
}

export class Token {
    id: UUID;
    user_id: string;
    expires: string | null;
    cookie: string;
    identity?: Record<string, any>;

    constructor(data: Token) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.expires = data.expires;
        this.cookie = data.cookie;
        this.identity = data.identity;
    }

    public static init(data: Token) {
        return new Token(data);
    }

    public static fromDB(data: any) {
        return Token.init({
            id: data.token_id,
            user_id: data.user_id,
            expires: data.token_expires,
            cookie: data.token_cookie,
            identity: data.token_identity,
        });
    }
}

export type ExpenseSplit = Record<
    UUID,
    {
        percent?: number;
        fixed?: number;
        shares?: number;
        adjustment?: number;
    }
>;

export class Expense {
    id: UUID;
    payee_id: UUID;
    payer_ids: UUID[];
    split: ExpenseSplit;
    subtotal: number;
    tax: number;
    name: string;
    description: string;
    date: Date;
    created_at: string;
    updated_at: string;

    constructor(data: Omit<Expense, "total">) {
        this.id = data.id;
        this.payee_id = data.payee_id;
        this.payer_ids = data.payer_ids;
        this.split = data.split;
        this.subtotal = data.subtotal;
        this.tax = data.tax;
        this.name = data.name;
        this.description = data.description;
        this.date = data.date;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    public static init(data: Omit<Expense, "total">) {
        return new Expense(data);
    }

    public static fromDB(data: any) {
        return Expense.init({
            id: data.expense_id,
            payee_id: data.payee_id,
            payer_ids: data.payer_ids,
            split: data.expense_split,
            subtotal: data.expense_subtotal,
            tax: data.expense_tax,
            name: data.expense_name,
            description: data.expense_description,
            date: data.expense_date,
            created_at: data.expense_created_at,
            updated_at: data.expense_updated_at,
        });
    }

    get total() {
        return this.subtotal + this.tax;
    }
}

export class Membership {
    id: UUID;
    user_id: UUID;
    group_id: UUID;
    role: string;
    created_at: string;
    updated_at: string;

    constructor(data: Membership) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.group_id = data.group_id;
        this.role = data.role;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    public static init(data: Membership) {
        return new Membership(data);
    }

    public static fromDB(data: any) {
        return Membership.init({
            id: data.membership_id,
            user_id: data.user_id,
            group_id: data.group_id,
            role: data.membership_role,
            created_at: data.membership_created_at,
            updated_at: data.membership_updated_at,
        });
    }
}

export class Group {
    id: UUID;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    created_at: string;
    updated_at: string;
    membership?: Membership;

    constructor(data: Group) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.color = data.color;
        this.icon = data.icon;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    public static init(data: Group) {
        return new Group(data);
    }

    public static fromDB(data: any) {
        return Group.init({
            id: data.group_id,
            name: data.group_name,
            description: data.group_description,
            color: data.group_color,
            icon: data.group_icon,
            created_at: data.group_created_at,
            updated_at: data.group_updated_at,
        });
    }
}

export type TokenSet = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
};
