// https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6
import * as bcrypt from 'bcrypt';
import { Document, Schema } from "mongoose"
import * as connections from '../config/connection/connection';

export interface IAccount extends Document {
    id?: any;
    email: string;
    password: string;
    active: boolean;
    type: string
    // photo: string;
    generateHash(password: any):string;
    validPassword(hash: string, password: any):boolean;
  }

let schema = new Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique'],
        uniqueCaseInsensitive: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    active: {
        type: Boolean,
        default: true,/// em produção Alterar
    },
    type:{
        type: String
    }
    // photo: {
    //     type: String
    // },
    // settings: {
    //     type: Settings.schema,
    // }

}, {
        timestamps: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
);

// Validations
schema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

schema.methods.validPassword = function (hash, password) {
    return bcrypt.compareSync(password, hash);
};

schema.pre<IAccount>('save', function ( next){
  
  const account = <IAccount>this;
  if(account.password){
    account.password = account.generateHash(account.password);
  }
  next();

});

// export let UserSchema = model<IAccount>('user', schema, 'users', true);
export let AccountModel = connections.db.model <IAccount>('account', schema, 'accounts');