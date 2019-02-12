import { UserModel, IUser } from "../../models/user.model";
import { AccountModel } from "../../models/account.model";
import { Migration } from "./Migrate";
import { OAuthClientModel } from "../../models/oauth-client.model";

// const Users = [
//   accountID =>
//     new UserModel({
//       name: "Administrador",
//       gender: "MALE",
//       phone: "11992382085",
//       birthDate: new Date(),
//       account: accountID
//     }),
//   {
//     dependencies: new AccountModel({
//       email: "admin@admin.com.br",
//       password: AccountModel.schema.methods.generateHash("linux123")
//     }),
//     document: new UserModel({
//       name: "Administrador",
//       gender: "MALE",
//       phone: "11992382085",
//       birthDate: new Date(),
//       account: accountID
//     })
//   }
// ];

// export { Users };

export default class UserMigration implements Migration<IUser> {
  async run(): Promise<IUser> {
    let account = new AccountModel({
      email: "admin@admin.com.br",
      password: "linux123"
    });

    account = await account.save();

    let user = new UserModel({
      name: "Administrador",
      gender: "MALE",
      phone: "11992382085",
      birthDate: new Date(),
      account: account._id
    });

    await new OAuthClientModel({
      name: "KOA 2",
      clientId: "typescript-koa",
      clientSecret: "typescript@koa",
      account: account._id,
      grants: [
        "client_credentials",
        "refresh_token",
        "authorization_code",
        "password"
      ],
      redirectUris: [
        'http://localhost:3000/oauth2/callback',
        'http://localhost:4955/oauth/callback'
      ],
      accessTokenLifetime: 60 * 60, // 1 hour
      refreshTokenLifetime: 60 * 60 * 24 * 7, // 1 week
      scope: "account edit admin"
    }).save();

    return user.save();
  }
}
