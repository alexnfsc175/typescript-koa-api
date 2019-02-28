import { Context } from "koa";
import  OAuthTokenModel  from "../models/oauth-token.model";
import  UserModel  from "../models/user.model";
import  CustomerModel  from "../models/customer.model";
// import RBAC from "./RBCA";
import  RoleModel,{ IRole } from "../models/role.model";
import AccountModel from "../models/account.model";

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
    // RBCA
    // if(!RBAC.isInitialized()){
    //   let roles = await RoleModel.find({}).populate({path:'inherits'});
    //   RBAC.create(roles);
    // }
    // RBCA
    //   roles.forEach(data,function(item,callback) {
    //     User.populate(item.comments,{ "path": "user" },function(err,output) {
    //         if (err) throw err; // or do something

    //         callback();
    //     });
    // }, function(err) {
    //     res.json(data);
    // });

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
    // rbac
    //   .can("user", "post:add")
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
    if (ctx.headers.authorization) {
      let bearerToken = ctx.headers.authorization.substring(7);

      let accessToken = await OAuthTokenModel.findOne({
        accessToken: bearerToken
      })
        .populate({
          path: "account",
          select: { password: 0 },
          populate: { path: 'role' }
        }) //Não traz esses dois campos
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
        //RBCA
        // let role = accessToken.account.role;
        // let result = await RBAC.getInstance().can(role.name, "account:*")
        // console.log('account:*=', result);
        //RBCA
      }
    }
    await next();
  }
}
