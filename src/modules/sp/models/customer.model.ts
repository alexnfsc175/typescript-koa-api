import { Document, Schema, Types } from "mongoose";
import * as connections from "../connection/connection";
import AccountModel, { IAccount } from "./account.model";

import SettingsModel, { ISettings } from "./settings.model";
import { ISubsidiary } from "./subsidiary.model";

export interface ICustomer extends Document {
  id?: any;
  name: string;
  account: IAccount;
  company: ISubsidiary; 
  urlLogo: string;
  code: Number;
  deliveryTime: Number;
  settings: ISettings
}

let schema = new Schema(
  {
    name: {
      type: String
    },
    account: {
      type: Types.ObjectId,
      ref: "account",
      required: true
    },
    company: {
      type: Types.ObjectId,
      ref: 'subsidiary',
    },
    logo: {
      type: String
    },
    code: {
      type: Number,
      required: true
    }, // Para alteração cad cli
    deliveryTime: {
      type: Number
    },
    settings: {
      type: SettingsModel.schema,
    }
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

export default connections.db.model<ICustomer>(
  "customer",
  schema,
  "customers"
);
