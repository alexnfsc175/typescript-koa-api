import { Context } from "koa";
import RoleModel from "../models/role.model";

/**
 * @export
 * @class RoleController
 */
export default class RoleController {
  /**
   * @param {Context} ctx
   * @param {Function} next
   * @memberof RoleController
   */
  static async list(ctx: Context, next: Function) {
    let roles = await RoleModel.find({}).populate({ path: "inherits" });
    ctx.body = roles;
    ctx.status = 200;
  }

  
}
