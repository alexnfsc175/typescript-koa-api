// https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6
import { Document, Model, Schema, Types } from 'mongoose';
import * as connections from '../connection/connection';
import AccountModel, { IAccount } from './account.model';
import SettingsModel, { ISettings } from './settings.model';
import { ISubsidiary } from './subsidiary.model';
export interface IUser extends Document {
  id?: any;
  name: string;
  birthDate: Date;
  gender: string;
  phone: string;
  photo: string;
  account: IAccount;
  companies: ISubsidiary[],
  settings: ISettings
}

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    birthDate: {
      type: Date,
    },
    gender: {
      type: String,
      uppercase: true,
      default: 'MALE',
      enum: ['FEMALE', 'MALE'],
      validate: {
        validator(v) {
          return /FEMALE|MALE/i.test(v);
          // return ['FEMALE', 'MALE'].indexOf(v) > -1;
        },
        message: (props) => `${props.value} is not a valid gender!`,
      },
      required: [true, 'User gender required'],
    },
    phone: {
      type: String,
      // validate: {
      //     validator: function (v) {
      //         // return /\d{3}-\d{3}-\d{4}/.test(v);
      //         return /^(?:(55\d{2})|\d{2})[6-9]\d{8}$/gm.test(v);
      //     },
      //     message: props => `${props.value} is not a valid phone number!`
      // },
      required: [true, 'User phone number required'],
    },
    // location: {
    //     type: Geolocation.schema,
    //     index: '2dsphere'
    // },
    // locationHistory: [{
    //     type: Geolocation.schema,
    //     index: '2dsphere'
    // }],
    photo: {
      type: String,
    },
    settings: {
        type: SettingsModel.schema,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'account',
    },
    companies: [{
      type: Schema.Types.ObjectId,
      ref: 'subsidiary',
    }],
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

// schema.pre('find', function () {
//     // `this` is an instance of mongoose.Query
//     this.populate('account');
// });

export default connections.db.model<IUser>('user', schema, 'users');
