import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// HTTP server imports
import Router from "koa-router";

// Library imports
import _ from "lodash";
import { error, response } from "../../utils";
import { Decimal } from "decimal.js";

// Fishhat imports
import { db, User, Group, Membership, Expense, UUID } from "@fishhat/db";

const groups_router = new Router();

groups_router.get("/groups", async (ctx) => {
    try {
        const raw_groups = await db.any(
            `
            SELECT g.*, m.*
            FROM groups g
            JOIN memberships m USING(group_id)
            WHERE user_id = $1
        `,
            [ctx.state.user.id]
        );

        const group_ids = raw_groups.map((row: any) => row.group_id);

        const raw_members = await db.any(
            `
            SELECT m.*, u.user_email, u.user_profile_picture, u.user_first_name, u.user_last_name
            FROM memberships m
            INNER JOIN users u USING(user_id)
            WHERE m.group_id IN ($1:csv)
        `,
            [group_ids]
        );

        const group_members = new Map<UUID, User[]>();

        for (const raw_member of raw_members) {
            const member = User.fromDB(raw_member);
            const membership = Membership.fromDB(raw_member);
            if (group_members.has(membership.group_id)) {
                group_members.get(membership.group_id)!.push(member);
            } else {
                group_members.set(membership.group_id, [member]);
            }
        }

        const groups = raw_groups.map((row: any) => {
            const group = Group.fromDB(row);
            const membership = Membership.fromDB(row);
            group.membership = membership;
            group.members = group_members.get(group.id) || [];
            return group;
        });

        return response(ctx, groups);
    } catch (err) {
        console.log(err);
        return error(ctx, {
            message: "Failed to fetch groups",
            code: "INTERNAL_ERROR",
            status: 500,
        });
    }
});

groups_router.get("/groups/:group_id", async (ctx) => {
    try {
        const raw_group = await db.one(
            `
            SELECT * FROM groups
            LEFT JOIN memberships USING(group_id)
            WHERE group_id = $1 AND user_id = $2
        `,
            [ctx.params.group_id, ctx.state.user.id]
        );

        const group = Group.fromDB(raw_group);
        const membership = Membership.fromDB(raw_group);

        group.membership = membership;

        const raw_members = await db.any(
            `
            SELECT m.*, u.user_email, u.user_profile_picture, u.user_first_name, u.user_last_name
            FROM memberships m
            INNER JOIN users u USING(user_id)
            WHERE m.group_id = $1
        `,
            [group.id]
        );

        const members = raw_members.map((row: any) =>
            Object.assign(User.fromDB(row), { membership: Membership.fromDB(row) })
        );

        group.members = members;

        return response(ctx, group);
    } catch (err) {
        return error(ctx, {
            message: "Group not found",
            code: "NOT_FOUND",
            status: 404,
        });
    }
});

groups_router.get("/groups/:group_id/summary", async (ctx) => {
    try {
        const raw_group = await db.one(
            `
            SELECT * FROM groups
            LEFT JOIN memberships USING(group_id)
            WHERE group_id = $1 AND user_id = $2
        `,
            [ctx.params.group_id, ctx.state.user.id]
        );

        const group = Group.fromDB(raw_group);
        const membership = Membership.fromDB(raw_group);

        group.membership = membership;

        const raw_expenses = await db.any(
            `
            SELECT e.* FROM expenses e
            WHERE e.group_id = $1
        `,
            [ctx.params.group_id]
        );

        const expenses = raw_expenses.map((row: any) => Expense.fromDB(row));

        const formatted_expenses = expenses.map((expense: Expense) => {
            return {
                payee_id: expense.payee_id,
                payer_ids: expense.payer_ids,
                split: expense.split,
                subtotal: new Decimal(expense.subtotal),
                tax: new Decimal(expense.tax),
            };
        });

        // List of members
        const members = new Map<UUID, User | null>();

        // For each expense payee add to member_ids (this only adds poeple who have left the group)
        for (const expense of formatted_expenses) {
            members.set(expense.payee_id, null);
            for (const payer_id of expense.payer_ids) {
                members.set(payer_id, null);
            }
        }

        // Get all members of the group
        const raw_members = await db.any(
            `
            SELECT m.*, u.user_id, u.user_email, u.user_first_name, u.user_last_name, u.user_profile_picture FROM memberships m
            JOIN users u USING(user_id)
            WHERE m.group_id = $1
            AND m.membership_status = 'active'
        `,
            [ctx.params.group_id]
        );

        // For each member add to members
        for (const raw_member of raw_members) {
            const user = User.fromDB(raw_member);
            members.set(raw_member.user_id, user);
        }

        // Make map to track groub member balances
        const summary = new Map<UUID, Record<UUID, Decimal>>();

        const member_ids = Array.from(members.keys());
        // Initialize balance for each payer/member
        for (const member_id of member_ids) {
            const other_member_ids = _.without(member_ids, member_id);
            const balances: Record<UUID, Decimal> = {};
            for (const other_member_id of other_member_ids) {
                balances[other_member_id] = new Decimal(0);
            }
            summary.set(member_id, balances);
        }

        // Calculate balance for each payer
        for (const expense of formatted_expenses) {
            // We can be sure this is defined because of the two for loops above
            // const payee = summary.get(expense.payee_id)!;
            let total = expense.subtotal.plus(expense.tax);

            for (const payer_id of expense.payer_ids) {
                const payer = summary.get(payer_id)!;
                const split = expense.split[payer_id];

                let amount = new Decimal(0);

                if (split.fixed) {
                    // fixed amount to deduct
                    amount = new Decimal(split.fixed);
                } else if (split.percent) {
                    // percentage to deduct
                    const percent = new Decimal(split.percent).div(100);
                    amount = total.mul(percent);
                }

                payer[expense.payee_id] = payer[expense.payee_id].sub(amount);
            }
        }

        const formatted: Record<UUID, { user: User | null; member_id: UUID; debts: Record<string, Number> }> = {};

        for (const [member_id, debts] of summary.entries()) {
            const user = members.get(member_id);
            const formatted_debts: Record<string, Number> = {};

            for (const [debtor_id, amount] of Object.entries(debts)) {
                formatted_debts[debtor_id] = amount.toNumber();
            }

            formatted[member_id] = {
                user: user ? user : null,
                member_id,
                debts: formatted_debts,
            };
        }

        return response(ctx, formatted);
    } catch (err) {
        console.log(err);

        return error(ctx, {
            message: "Group not found",
            code: "NOT_FOUND",
            status: 404,
        });
    }
});

groups_router.post("/groups", async (ctx) => {
    // @ts-ignore
    const { name } = ctx.request.body;

    if (!name) {
        return error(ctx, {
            message: "name is required",
            code: "MISSING_FIELDS",
            status: 400,
        });
    }

    try {
        // Create group
        const raw_group = await db.one(
            `
            INSERT INTO groups (group_name)
            VALUES ($1)
            RETURNING *
        `,
            [name]
        );

        const group = Group.fromDB(raw_group);

        // Add user as owner
        await db.none(
            `
            INSERT INTO memberships (user_id, group_id, membership_role, membership_status)
            VALUES ($1, $2, 'owner', 'active')
        `,
            [ctx.state.user.id, group.id]
        );

        return response(ctx, group);
    } catch (err) {
        return error(ctx, {
            message: "Failed to create group",
            code: "INTERNAL_ERROR",
            status: 500,
        });
    }
});

groups_router.post("/groups/:group_id/invite", async (ctx) => {
    // @ts-ignore
    const { email } = ctx.request.body;

    if (!email) {
        return error(ctx, {
            message: "email is required",
            code: "MISSING_FIELDS",
            status: 400,
        });
    }

    let raw_group;

    try {
        // Get group
        raw_group = await db.one(
            `
            SELECT * FROM groups
            WHERE group_id = $1
        `,
            [ctx.params.group_id]
        );
    } catch (err) {
        return error(ctx, {
            message: "Group not found",
            code: "NOT_FOUND",
            status: 404,
        });
    }

    const group = Group.fromDB(raw_group);

    let raw_user;

    try {
        // Get user
        raw_user = await db.one(
            `
            SELECT * FROM users
            WHERE user_email = $1
        `,
            [email]
        );
    } catch (err) {
        return error(ctx, {
            message: "User not found",
            code: "NOT_FOUND",
            status: 404,
        });
    }

    const user = User.fromDB(raw_user);

    try {
        // Invite user
        await db.none(
            `
            INSERT INTO memberships (group_id, user_id, membership_role, membership_status)
            VALUES ($1, $2, 'member', 'pending')
        `,
            [group.id, user.id]
        );

        return response(ctx, null, 201);
    } catch (err: any) {
        if (err?.constraint === "memberships_group_id_user_id_index") {
            return error(ctx, {
                message: "User is already a member of this group",
                code: "BAD_REQUEST",
                status: 400,
            });
        }

        return error(ctx, {
            message: "Failed to invite user",
            code: "INTERNAL_ERROR",
            status: 500,
        });
    }
});

groups_router.post("/groups/:id/join", async (ctx) => {
    try {
        const invitations = await db.any(
            `
            SELECT * FROM memberships
            WHERE user_id = $1
            AND group_id = $2
            AND membership_status = 'pending'
        `,
            [ctx.state.user.id, ctx.params.id]
        );

        if (invitations.length === 0) {
            return error(ctx, {
                message: "No pending invitations",
                code: "BAD_REQUEST",
                status: 400,
            });
        } else {
            await db.none(
                `
                UPDATE memberships
                SET membership_status = 'active'
                WHERE user_id = $1
                AND group_id = $2
            `,
                [ctx.state.user.id, ctx.params.id]
            );

            return response(ctx, null, 201);
        }
    } catch (err) {
        // TODO: More specific error handling
        return error(ctx, {
            message: "Group not found",
            code: "NOT_FOUND",
            status: 404,
        });
    }
});

groups_router.delete("/groups/:id/leave", async (ctx) => {
    // TODO
});

export { groups_router };
