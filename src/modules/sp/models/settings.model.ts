import { Document, Schema } from 'mongoose';
import * as connections from '../connection/connection';
import { ISubsidiary } from './subsidiary.model';


export interface ISettings extends Document {
  id?: any;
  defaultCompany: ISubsidiary;
}

const schema = new Schema(
  {
    defaultCompany: {
      type: Schema.Types.ObjectId,
      ref: 'subsidiary',
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

export default connections.db.model<ISettings>('setting', schema, 'settings');
