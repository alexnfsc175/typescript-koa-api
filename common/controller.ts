import { Context } from 'koa';

export interface Controller {
    // isAuthenticate: Boolean = true;
    // GET /users
    index(ctx: Context, next: Function)
    // GET /users/create
    create(ctx: Context, next: Function)

    // POST /users
    store(ctx: Context, next: Function)

    // GET /users/{user}
    show(ctx: Context, next: Function)

    // GET /users/{user}/edit
    edit(ctx: Context, next: Function)

    // PUT/PATCH /users/{user}
    update(ctx: Context, next: Function)

    // DELETE 	/users/{user}
    destroy(ctx: Context, next: Function)
}