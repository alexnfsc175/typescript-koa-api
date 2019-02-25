import { Document, Schema, Types } from "mongoose";
import * as connections from "../config/connection/connection";
import AccountModel, { IAccount } from "./account.model";

export interface ICustomer extends Document {
  id?: any;
  name: string;
  account: IAccount;
  urlLogo: string;
  code: Number;
  deliveryTime: Number;
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
    logo: {
      type: String
    },
    code: {
      type: Number,
      required: true
    }, // Para alteração cad cli
    deliveryTime: {
      type: Number
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
