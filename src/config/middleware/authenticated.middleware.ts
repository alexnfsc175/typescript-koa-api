import { Context } from "koa";
import { OAuthTokenModel } from "../../models/oauth-token.model";
import { UserModel } from "../../models/user.model";
import { CustomerModel } from "../../models/customer.model";
import RBAC from "./RBCA";
// Teste
const opts = {
  user: {
    // Role name
    can: [
      // list of allowed operations
      "account",
      "post:add",
      {
        name: "post:save",
        when: async params => params.userId === params.ownerId
      },
      "user:create",
      {
        name: "user:*",
        when: async params => params.id === params.userId
      }
    ]
  },
  manager: {
    can: ["post:save", "post:delete", "account:*"],
    inherits: ["user"]
  },
  admin: {
    can: ["rule the server"],
    inherits: ["manager"]
  }
};

// Teste

export default class IsAuthendicatedMiddleware {
  constructor() {}
  // koa-ratelimit
  public static async use(ctx: Context, next: Function) {
    let rbac = RBAC.create(opts);
    // rbac
    //   .can("user", "post:save", { userId: 1, ownerId: 2 })
    //   .then(result => {
    //     if (result) {
    //       // we are allowed access
    //     } else {
    //       // we are not allowed access
    //     }
    //   })
    //   .catch(err => {
    //     // something else went wrong - refer to err object
    //   });
    rbac
      .can("user", "post:add")
      .then(result => {
        if (result) {
          // we are allowed access
        } else {
          // we are not allowed access
        }
      })
      .catch(err => {
        // something else went wrong - refer to err object
      });
    if (ctx.headers.authorization) {
      let bearerToken = ctx.headers.authorization.substring(7);

      let accessToken = await OAuthTokenModel.findOne({
        accessToken: bearerToken
      })
        .populate({ path: "account", select: { password: 0 } }) //Não traz esses dois campos
        .lean();

      if (accessToken && accessToken.account) {
        let user = await UserModel.findOne({ account: accessToken.account });
        if (user) ctx.authendicated = user;
        else {
          let customer = await CustomerModel.findOne({
            account: accessToken.account
          });
          if (customer) ctx.authendicated = customer;
        }
      }
    }
    await next();
  }
}
