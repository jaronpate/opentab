import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// HTTP server imports
import Router from 'koa-router';

// Library imports
import _ from "lodash";
import { error, response } from '../../utils';

// Fishhat imports
import { db, Expense } from '@fishhat/db';

const expenses_router = new Router();

expenses_router.get('/groups/:group_id/expenses', async (ctx) => {
    try {
        const raw_expenses = await db.any(`
            SELECT e.* FROM expenses e
            INNER JOIN memberships m USING(group_id)
            WHERE e.group_id = $1 AND m.user_id = $2 AND m.membership_status = 'active'
        `, [ctx.params.group_id, ctx.state.user.id]);

        const expenses = raw_expenses.map((row: any) => {
            return Expense.fromDB(row);
        });

        return response(ctx, expenses);
    } catch (err) {
        return error(ctx, {
            message: 'Failed to fetch expenses',
            code: 'INTERNAL_ERROR',
            status: 500,
        });
    }
});

expenses_router.post('/groups/:group_id/expenses', async (ctx) => {
    const { name, subtotal, tax, date, description, split, payee_id, payer_ids } = ctx.request.body;

    if (!name || !subtotal || !payer_ids || !split) {
        return error(ctx, {
            message: 'name, sub_total, payer_ids, and split are required',
            code: 'MISSING_FIELDS',
            status: 400,
        });
    }

    if (payer_ids.length === 0) {
        return error(ctx, {
            message: 'At least one payer is required',
            code: 'MISSING_FIELDS',
            status: 400,
        });
    }

    const member_ids = _.uniq([ctx.state.user.id, payee_id, ...payer_ids]);

    try {
        const memberships = await db.any(`
            SELECT m.membership_id FROM memberships m
            WHERE m.group_id = $1
            AND m.user_id IN ($2:csv)
            AND m.membership_status = 'active'
        `, [ctx.params.group_id, member_ids]);

        if (memberships.length !== member_ids.length) {
            return error(ctx, {
                message: 'One or more members are not in the group',
                code: 'BAD_REQUEST',
                status: 400,
            });
        }
    } catch (err) {
        return error(ctx, {
            message: 'Group not found',
            code: 'NOT_FOUND',
            status: 404,
        });
    }

    const new_expense: Partial<Expense> = {
        name,
        subtotal,
        tax: tax ?? 0,
        date: date ?? new Date(),
        description,
        split,
        payee_id: payee_id ?? ctx.state.user.id,
        payer_ids
    }
    
    try {
        const raw_expense = await db.one(`
            INSERT INTO expenses (group_id, expense_name, expense_description, expense_date,  expense_subtotal, expense_tax, expense_split, payee_id, payer_ids)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::UUID[])
            RETURNING *
        `, [ctx.params.group_id, new_expense.name, new_expense.description, new_expense.date, new_expense.subtotal, new_expense.tax, new_expense.split, new_expense.payee_id, new_expense.payer_ids]);

        const expense = Expense.fromDB(raw_expense);

        return response(ctx, expense);
    } catch (err) {
        return error(ctx, {
            message: 'Failed to create expense',
            code: 'INTERNAL_ERROR',
            status: 500,
        });
    }
});

expenses_router.get('/groups/:group_id/expenses/:id', async (ctx) => {
    try {
        // Get expense & check if user is an active member of the group
        const raw_expense = await db.one(`
            SELECT e.* FROM expenses e
            INNER JOIN memberships m USING(group_id)
            WHERE e.expense_id = $1 AND m.user_id = $2 AND m.membership_status = 'active'
        `, [ctx.params.id, ctx.state.user.id]);

        const expense = Expense.fromDB(raw_expense);

        return response(ctx, expense);
    } catch (err) {
        return error(ctx, {
            message: 'Expense not found',
            code: 'NOT_FOUND',
            status: 404,
        });
    }
});

expenses_router.patch('/groups/:group_id/expenses/:expense_id', async (ctx) => {
    const { name, subtotal, tax, date, description, payer_ids } = ctx.request.body;

    if (!name && !subtotal && !tax && !date && !description && !payer_ids) {
        return error(ctx, {
            message: 'At least one field is required',
            code: 'MISSING_FIELDS',
            status: 400,
        });
    }

    // Check if user is an active member of the group
    await db.one(`
        SELECT * FROM memberships m
        WHERE m.group_id = $1 AND m.user_id = $2
    `, [ctx.params.group_id, ctx.state.user.id]);

    // Construct update object
    const update = {
        expense_name: name,
        expense_subtotal: subtotal,
        expense_tax: tax,
        expense_date: date,
        expense_description: description,
        payer_ids
    };

    // Generate SQL SET clause
    const sets = db.helpers.sets(update, [
        { name: 'expense_name'},
        { name: 'expense_subtotal' },
        { name: 'expense_tax' },
        { name: 'expense_date' },
        { name: 'expense_description' },
        { name: 'payer_ids', cast: 'UUID[]' }
    ]);

    // Attempt update
    try {
        const raw_expense = await db.one(`
            UPDATE expenses
            SET ${sets}
            WHERE expense_id = $1 AND group_id = $2 AND payee_id = $3
            RETURNING *
        `, [ctx.params.expense_id, ctx.params.group_id, ctx.state.user.id]);

        const expense = Expense.fromDB(raw_expense);

        return response(ctx, expense);
    } catch (err) {
        console.log(err);
        return error(ctx, {
            message: 'Failed to update expense',
            code: 'INTERNAL_ERROR',
            status: 500,
        });
    }
});

expenses_router.delete('/groups/:group_id/expenses/:id', async (ctx) => {
    try {
        // Check if user is a member of the group
        await db.one(`
            SELECT * FROM memberships m
            WHERE m.group_id = $1 AND m.user_id = $2
        `, [ctx.params.group_id, ctx.state.user.id]);

        // Delete expense
        await db.none(`
            DELETE FROM expenses e
            WHERE e.expense_id = $1 AND e.group_id = $2 AND e.payee_id = $3
        `, [ctx.params.id, ctx.params.group_id, ctx.state.user.id]);

        return response(ctx, null, 204);
    } catch (err) {
        return error(ctx, {
            message: 'Failed to delete expense',
            code: 'INTERNAL_ERROR',
            status: 500,
        });
    }
});

export { expenses_router };