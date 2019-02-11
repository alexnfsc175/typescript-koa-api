import { AccountModel, IAccount } from "../models/account.model";
import { Context } from "koa";

/**
 * @export
 * @class AccountController
 */
export default class AccountController {
  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof AccountController
   */
  static async findAll(ctx: Context, next: Function) {
    const users: IAccount[] = await AccountModel.find();

    ctx.body = users;
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof AccountController
   */
  static async find(ctx: Context, next: Function) {
    const user: IAccount = await AccountModel.findOne({ _id: ctx.params.id });

    ctx.body = user;
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof AccountController
   */
  static async create(ctx: Context, next: Function) {
    const user: IAccount = await AccountModel.create(ctx.request.body);

    ctx.body = user;
    return (ctx.status = 200);
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof AccountController
   */
  static async delete(ctx: Context, next: Function) {
    const deleted = await AccountModel.deleteOne({ _id: ctx.params.id });

    ctx.body = deleted;
    return (ctx.status = 200);
  }
}