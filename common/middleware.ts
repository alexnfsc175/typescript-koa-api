import { Context } from "koa";
import { AccessModifiers } from './accessModifiers'

export abstract class Middleware extends AccessModifiers {
    constructor() { super() }
    // abstract async use(ctx: Context, next: Function)
    abstract async use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any>

    static getPublic(list: any[]) {
        return list.filter(item => item.isPublic());
    }

    static getPrivate(list: any[]) {
        return list.filter(item => item.isPrivate());
    }

}