
import { BaseContext } from 'koa';
import * as Data from './data';


export default class UserController{
    constructor(parameters) {
        
    }

    public static async getUsers(ctx: BaseContext, next: Function){
        ctx.body = Data.users;
        return ctx.status = 200;
    }
}