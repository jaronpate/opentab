import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// HTTP server imports
import Router from 'koa-router';

// Library imports
import _ from "lodash";

// Fishhat imports
import { db, User, Token } from '@fishhat/db';
import JustHash from '@fishhat/just-hash';
import { error, response } from '../utils';

const auth_router = new Router({ prefix: '/auth' });

// Auth Routes
// ========================================================================

auth_router.post('/register', async (ctx) => {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
        return error(ctx, {
            message: 'email and password are required',
            code: 'MISSING_FIELDS',
            status: 400,
        });
    }

    const new_user: Partial<User> = {
        email,
        // Hash, salt, and store password
        password: JustHash.hashPassword(password)
    };

    try {
        const raw_user = await db.one(`
            INSERT INTO users (user_email, user_password)
            VALUES ($1, $2)
            RETURNING *
        `, [new_user.email, new_user.password]);
    
        const user = _.omit(User.fromDB(raw_user), 'password');
    
        return response(ctx, user);
    } catch (err) {
        console.error(err);
        return error(ctx, {
            message: 'Failed to create user',
            code: 'INTERNAL_ERROR',
            status: 500,
        });
    }
});

auth_router.post('/login', async (ctx) => {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
        return error(ctx, {
            message: 'email and password are required',
            code: 'MISSING_FIELDS',
            status: 400,
        });
    }

    try {
        const raw_user = await db.one(`
            SELECT * FROM users
            WHERE user_email = $1
        `, [email]);

        const user = User.fromDB(raw_user);

        if (!JustHash.validatePassword(password, user.password)) {
            return error(ctx, {
                message: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS',
                status: 400,
            });
        }

        const cookie = JustHash.generateToken(32);

        const raw_token = await db.one(`
            INSERT INTO tokens (user_id, token_cookie)
            VALUES ($1, $2)
            RETURNING *
        `, [user.id, cookie]);

        const token = Token.fromDB(raw_token);

        ctx.status = 200;
        ctx.response.body = {
            access_token: token.cookie,
            refresh_token: token.cookie,
            expires_in: token.expires ? new Date(token.expires).getTime() - Date.now() : null,
            token_type: 'Bearer'
        };

        return;
    } catch (err) {
        return error(ctx, {
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS',
            status: 400,
        });
    }
});

export { auth_router };