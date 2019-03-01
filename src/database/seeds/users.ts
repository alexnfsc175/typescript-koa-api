import { Migration } from './Migrate';

import AccountModel from '../../modules/sp/models/account.model';
import companyModel from '../../modules/sp/models/company.model';
import OAuthClientModel from '../../modules/sp/models/oauth-client.model';
import RoleModel from '../../modules/sp/models/role.model';
import UserModel, { IUser } from '../../modules/sp/models/user.model';
import SubsidiaryModel from '../../modules/sp/models/subsidiary.model';

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
  public async run(): Promise<IUser> {
    
    let sp = await new SubsidiaryModel({name: 'LMX SP LTDA'}).save();
    let sc = await new SubsidiaryModel({name: 'LMX SC LTDA'}).save();

    let company = await new companyModel({
      name: 'LMX LTDA',
      subsidiaries: [
        sp._id,
        sc._id
      ],
    }).save();
    
    sp.company = company._id;
    sc.company = company._id;

    await Promise.all([sp.save(), sc.save()]);

    let userRole = new RoleModel({
      name: 'user',
      can: ['account', 'post:add', 'post:save', 'user:create'],
    });

    userRole = await userRole.save();

    let managerRole = new RoleModel({
      name: 'manager',
      can: ['post:save', 'post:delete', 'account:*'],
      inherits: [userRole._id],
    });

    let customerRole = new RoleModel({
      name: 'customer',
      can: ['panel:read'],
    });

    customerRole = await customerRole.save();
    managerRole = await managerRole.save();

    let account = new AccountModel({
      email: 'admin@admin.com.br',
      password: 'linux123',
      role: managerRole._id,
    });

    account = await account.save();

    const user = new UserModel({
      name: 'Administrador',
      gender: 'MALE',
      phone: '11992382085',
      birthDate: new Date(),
      account: account._id,
      settings: { defaultCompany: sp._id }
    });

    user.companies.push(sp._id);
    user.companies.push(sc._id);

    await new OAuthClientModel({
      name: 'Lmx Lógistica',
      clientId: 'lmx-logistica',
      clientSecret: 'lmx-logistica@password',
      account: account._id,
      grants: [
        'client_credentials',
        'refresh_token',
        'authorization_code',
        'password',
      ],
      redirectUris: [
        'http://localhost:3000/oauth2/callback',
        'http://localhost:4955/oauth/callback',
      ],
      accessTokenLifetime: 60 * 60, // 1 hour
      refreshTokenLifetime: 60 * 60 * 24 * 7, // 1 week
      scope: 'account edit admin',
    }).save();

    return user.save();
  }
}
