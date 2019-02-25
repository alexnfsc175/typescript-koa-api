// https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6
import { Document, Schema, Types } from "mongoose";
import * as connections from "../config/connection/connection";
import OauthClientModel, { IOAuthClient } from './oauth-client.model';
import AccountModel from "./account.model";

export interface IOAuthCode extends Document {
  id?: any;
  authorizationCode: string;
  expiresAt: Date;
  redirectUri: string;
  scope: string;
  clientId: string;
  client: IOAuthClient;
  account: string;
}

let schema = new Schema(
  {
    authorizationCode: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: { type: Date },
    redirectUri:{type: String},
    scope: { type: String },
    clientId: String,
    client: {
      type: Types.ObjectId,
      ref: "oauthclient"
    },
    account: {
      type: Types.ObjectId,
      ref: "account"
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

export default connections.db.model<IOAuthCode>(
  "oauthcode",
  schema,
  "oauthcodes"
);
