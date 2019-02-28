import AccountModel  from "../models/account.model";

const Accounts = [
  {
    document: new AccountModel({
      email: "admin@admin.com.br",
      password: AccountModel.schema.methods.generateHash("linux123")
    }),
    dependencies: null
  }
];

export { Accounts };
