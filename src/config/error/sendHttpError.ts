import { HttpError } from './index';
import { Context } from 'koa';

/**
 * @exports
 * @param {Request} req
 * @param {*} res
 * @param {Function} next
 */
export const sendHttpErrorModule: (ctx: Context, next: Function) => void = async (ctx: Context, next: Function) => {

    ctx.sendHttpError = (error: HttpError): void => {
        
        ctx.status = error.status;

        // • if this looks like an AJAX request
        // • if this request has a "json" content-type AND ALSO has its "Accept" header set
        // • if this request DOESN'T explicitly want HTML
        if (
            // req.xhr
            ctx.is('json')
            || (ctx.is('json') && ctx.get('Accept'))
            || !(ctx.get('Accept') && ctx.get('Accept').indexOf('html') !== -1)
        ) {
            ctx.body = ({
                status: error.status,
                name: error.name,
                message: error.message
            });
        } else {
            // Isso não existe
            ctx.render('error.ejs', {
                error
            });
        }
    };

    await next();
};
