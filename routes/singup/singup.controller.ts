import { Context } from 'koa';
import { Controller } from '../../common/controller';

class SingUpController implements Controller {


    // GET /users
    async index(ctx: Context, next: Function) {
    }

    // GET /users/create
    async create(ctx: Context, next: Function) { }

    // POST /users
    async store(ctx: Context, next: Function) { }

    // GET /users/{user}
    async show(ctx: Context, next: Function) {
    }

    // GET /users/{user}/edit
    async edit(ctx: Context, next: Function) { }

    // PUT/PATCH /users/{user}
    async update(ctx: Context, next: Function) { }

    // DELETE 	/users/{user}
    async destroy(ctx: Context, next: Function) { }
}

export const singUpController = new SingUpController();