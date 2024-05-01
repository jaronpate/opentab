import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// HTTP server imports
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from '@koa/bodyparser';

import { Logger, ResponseTime } from './middleware';
import { v1_router, auth_router } from './controllers';

// Library imports
import _ from "lodash";

// Define port
const PORT = process.env.PORT || 3000;

// Create Koa app
const app = new Koa();

// Setup router
const router = new Router();
const api_router = new Router({ prefix: '/api' });

// Error/404 handler
app.use(async (ctx, next) => {
    try {
        // Wait for pipeline
        await next();

        // 404 handler
        if (ctx.response.status === 404) {
            ctx.response.status = 404;
            ctx.body = {
                $errors: [
                    {
                        code: 'NOT_FOUND',
                        message: `${ctx.method} to ${ctx.url} was not found.`,
                    }
                ]
            };
        }
    } catch (err: any) {
        console.error(err);

        // Generic error handler
        ctx.status = err.status || 500;
        if (err.$errors) {
            ctx.body = {
                $errors: err.$errors,
            };
        }
    }
});

// Logger
app.use(Logger);
// Set Response Time Header
app.use(ResponseTime);
// Body Parser
app.use(bodyParser());

api_router.use(auth_router.routes(), v1_router.routes());
router.use(api_router.routes());
app.use(router.routes());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});