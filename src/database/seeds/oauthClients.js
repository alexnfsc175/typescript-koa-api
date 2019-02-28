import { Migration } from "./Migrate";

import OAuthClientModel, { IOAuthClient } from '../../models/oauth-client.model'

// const OAuthClients = [
//     new OAuthClientModel({
//         name: 'KOA 2',
//         clientId: 'typescript-koa',
//         clientSecret: 'typescript@koa',
//         grants: ['client_credentials', 'refresh_token', 'authorization_code', 'password'],
//         redirectUris: ['http://localhost:3000/oauth2/callback'],
//         accessTokenLifetime: 60 * 60, // 1 hour 
//         refreshTokenLifetime: 60 * 60 * 24 * 7, // 1 week  
//         scope: 'account edit admin'
//     })
// ]

// export { OAuthClients };

// export default class UserMigration implements Migration<IOAuthClient> {
//     async run(): Promise<IOAuthClient> {
//       let account = new AccountModel({
//         email: "admin@admin.com.br",
//         password: AccountModel.schema.methods.generateHash("linux123")
//       });
  
//       account = await account.save();
  
//       let user = new UserModel({
//         name: "Administrador",
//         gender: "MALE",
//         phone: "11992382085",
//         birthDate: new Date(),
//         account: account._id
//       });
  
//       return user.save();
//     }
//   }
  