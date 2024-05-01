import { User, db } from "@fishhat/db";
import Koa from "koa";
import _ from "lodash";

const Logger = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
    // Wait for pipeline
    await next();
    // Get response time
    const rt = ctx.response.get("X-Response-Time");
    // Log request
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
};

const ResponseTime = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
    // Get time before controller
    const start = Date.now();
    // Wait for pipeline
    await next();
    // Calculate passed time
    const ms = Date.now() - start;
    // Save in header and state
    ctx.set("X-Response-Time", `${ms}ms`);
    _.set(ctx.state.meta, "response_time", ms);
};

const UserAuth = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
    // Get token from header
    const token = ctx.request.header.authorization?.split(" ")[1];

    // Check if token is present
    if (!token) {
        // TODO: use error helper
        ctx.throw(401, "Unauthorized");
    }
    try {
        // Get user from token
        const raw_user = await db.one(`
            SELECT t.user_id, u.* FROM tokens t
            INNER JOIN users u USING(user_id)
            WHERE t.token_cookie = $1
        `, [token]);
        // Set user in context
        ctx.state.user = _.omit(User.fromDB(raw_user), 'password');;
    } catch (err) {
        // TODO: use error helper
        return ctx.throw(401, "Unauthorized");
    }

    // Wait for pipeline
    await next();
}

export { Logger, ResponseTime, UserAuth };