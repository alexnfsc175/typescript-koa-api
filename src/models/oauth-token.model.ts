// https://gist.github.com/brennanMKE/ee8ea002d305d4539ef6
import { Document, Schema, Types } from "mongoose";
import * as connections from "../config/connection/connection";
import OauthClientModel, { IOAuthClient } from "./oauth-client.model";
import AccountModel, { IAccount } from './account.model';

export interface IOAuthToken extends Document {
  id?: any;
  accessToken: string;
  accessTokenExpiresAt: Date;
  client: IOAuthClient | string; // Mudar para o tipo OAuthClient
  clientId: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  scope: string;
  account: IAccount | string; // o pacote oauth-server obriga que tenha esse nome
}

let schema = new Schema(
  {
    accessToken: {
      type: String,
      required: true,
      unique: true
    },
    accessTokenExpiresAt: { type: Date },
    client: {
      type: Schema.Types.ObjectId,
      ref: "oauthclient"
    }, 
    clientId: String,
    refreshToken: { type: String },
    refreshTokenExpiresAt: { type: Date },
    scope: { type: String },
    account: {
      type: Schema.Types.ObjectId,
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

export default connections.db.model<IOAuthToken>(
  "oauthtoken",
  schema,
  "oauthtokens"
);
