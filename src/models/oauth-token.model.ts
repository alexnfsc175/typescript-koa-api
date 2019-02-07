import * as mongoose from 'mongoose'
const Schema = mongoose.Schema;

const OAuthTokenSchema = new Schema({
    accessToken: {
        type: String,
        required: true,
        unique: true
    },
    accessTokenExpiresAt: { type: Date },
    client: { type: Object },
    clientId: String,
    refreshToken: { type: String },
    refreshTokenExpiresAt: { type: Date },
    scope: { type: String },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userId: { type: String }
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

export const OAuthToken = mongoose.model('OAuthToken', OAuthTokenSchema);