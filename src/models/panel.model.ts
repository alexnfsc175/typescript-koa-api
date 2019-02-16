import { Document, Schema, Types } from 'mongoose';
import * as connections from '../config/connection/connection';
import { IAccount } from './account.model';
import { ICustomer } from './customer.model';

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
      type: Types.ObjectId,
      ref: 'account',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    urlLogo: {
      type: String
    },
    customers: [
      {
        type: Types.ObjectId,
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

export let PanelModel = connections.db.model<IPanel>('panel', schema, 'panels');
