import { Context } from 'koa';
import * as Data from './data';
import { Controller } from '../../common/controller';
//https://gorrion.io/blog/node-express-js-typescript-sequelize/
class UsersController implements Controller {


    // GET /users
    async index(ctx: Context, next: Function) {

        ctx.body = Data.users;
        return ctx.status = 200;
    }

    // GET /users/create
    async create(ctx: Context, next: Function) { }

    // POST /users
    async store(ctx: Context, next: Function) { }

    // GET /users/{user}
    async show(ctx: Context, next: Function) {
        let params = ctx.params;
        let user = Data.users.find((element, index, array) => {
            return element.id == params.id;
        });

        ctx.body = user;
        ctx.status = 200;
        console.log('AQUI') ; 
        next();
    }

    // GET /users/{user}/edit
    async edit(ctx: Context, next: Function) { }

    // PUT/PATCH /users/{user}
    async update(ctx: Context, next: Function) { }

    // DELETE 	/users/{user}
    async destroy(ctx: Context, next: Function) { }
}

export const usersController = new UsersController();