import UserModel, { IUser } from "../models/user.model";
import { Context } from "koa";
import  OAuthClientModel  from "../models/oauth-client.model";

/**
 * @export
 * @class UserController
 */
export default class UserController {
  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof UserController
   */
  static async findAll(ctx: Context, next: Function) {
    const users: IUser[] = await UserModel.find();

    ctx.body = users;
    ctx.status = 200;
  }

  static async authenticated(ctx: Context, next: Function) {
    ctx.body =  ctx.authendicated;
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof UserController
   */
  static async find(ctx: Context, next: Function) {
    const user: IUser = await UserModel.findOne({
      _id: ctx.params.id
    }).populate({ path: "account", select: { email: 1, active: 1 } });



    ctx.body = user;
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof UserController
   */
  static async create(ctx: Context, next: Function) {
    const user: IUser = await UserModel.create(ctx.request.body);

    ctx.body = user;
    ctx.status = 200;
  }

  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof UserController
   */
  static async delete(ctx: Context, next: Function) {
    const deleted = await UserModel.deleteOne({ _id: ctx.params.id });

    ctx.body = deleted;
    ctx.status = 200;
  }
}
