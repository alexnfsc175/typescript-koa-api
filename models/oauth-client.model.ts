import * as mongoose from 'mongoose'
const Schema = mongoose.Schema;

const OAuthClientSchema = new Schema({
    name: String,
    clientId: { type: String, unique: true },
    clientSecret: { type: String, unique: true },
    grants: [{ type: String }],
    scope: { type: String },
    redirectUris: [{ type: String }],
    // redirectUri: { type: String },
    accessTokenLifetime: { type: Number }, //Client-specific lifetime of generated access tokens in seconds.
    refreshTokenLifetime: { type: Number } //Client-specific lifetime of generated refresh tokens in seconds.
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


export const OAuthClient = mongoose.model('OAuthClient', OAuthClientSchema);