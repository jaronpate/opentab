import Koa from 'koa';
import _ from "lodash";

export type FishhatError = {
    message: string;
    code: string;
    status: number;
};

// Response helpers
export const response = async (ctx: Koa.ParameterizedContext, data: any, status: number = 200) => {
    ctx.status = status;
    if (data) {
        ctx.response.body = {
            $data: data
        };
    }
};

export const error = async (
    ctx: Koa.ParameterizedContext,
    error: FishhatError | FishhatError[],
    status: number = 500
) => {
    if (_.isArray(error)) {
        ctx.throw(status, 'Many Errors', {
            $errors: error,
        });
    } else {
        ctx.throw(error.status, error.message, { $errors: [error] });
    }
};