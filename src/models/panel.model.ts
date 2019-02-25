import { Document, Schema, Types } from 'mongoose';
import * as connections from '../config/connection/connection';
import AccountModel, { IAccount } from './account.model';
import CustomerModel, { ICustomer } from './customer.model';

export interface IPanel extends Document {
  id?: any;
  account: IAccount,
  name: string,
  urlLogo: string,
  customers: ICustomer[],
  active: Boolean
}

let schema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'account',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    logo: {
      type: String
    },
    customers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'customer',
        required: true
      }
    ],
    active: {
      type: Boolean,
      default: false
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

export default connections.db.model<IPanel>('panel', schema, 'panels');
