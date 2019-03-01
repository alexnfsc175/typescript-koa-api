import { Document, Schema, Types } from 'mongoose';
import * as connections from '../connection/connection';
import AccountModel, { IAccount } from './account.model';
import CustomerModel, { ICustomer } from './customer.model';
import { ISubsidiary } from './subsidiary.model';

export interface IPanel extends Document {
  id?: any;
  account: IAccount,
  name: string,
  urlLogo: string,
  customers: ICustomer[],
  active: Boolean,
  company: ISubsidiary
}

let schema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'account',
      required: true
    },
    company: {
      type: Types.ObjectId,
      ref: 'subsidiary',
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
