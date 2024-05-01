import Router from 'koa-router';
import _ from 'lodash';
import { UserAuth } from '../../middleware';
import { response } from '../../utils';
import { groups_router } from './groups.controller';
import { expenses_router } from './expenses.controller';

const v1_router = new Router({ prefix: '/v1' });
// Middleware
v1_router.use(UserAuth);
// Child routers
v1_router.use(groups_router.routes(), expenses_router.routes());

v1_router.post('/logout', async (ctx) => {});

v1_router.get('/me', async (ctx) => {
    return response(ctx, _.omit(ctx.state.user, 'stripe_customer_id'));
});

export { v1_router };
