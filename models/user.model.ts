import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

// const Geolocation = require('./Geolocation');
// const Settings = require('./Settings');


const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique'],
        uniqueCaseInsensitive: true
    },
    // permissions: [{
    //     type: {
    //         type: String,
    //         enum: ["admin", "client", 'panel'],
    //         required: true,
    //         default: 'admin'
    //     },
    //     roles: [{
    //         type: String,
    //         enum: ["read", "create", "update", 'delete'],
    //         required: true,
    //         default: 'read'
    //     }]

    // }],
    birthDate: {
        type: Date
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    gender: {
        type: String,
        uppercase: true,
        default: 'MALE',
        enum: ['FEMALE', 'MALE'],
        validate: {
            validator: function (v) {
                return /FEMALE|MALE/i.test(v);
                // return ['FEMALE', 'MALE'].indexOf(v) > -1;
            },
            message: props => `${props.value} is not a valid gender!`
        },
        required: [true, 'User gender required']
    },
    active: {
        type: Boolean,
        default: true,
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
        required: [true, 'User phone number required']
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
        type: String
    },
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

// UserSchema.pre('save', function (next) {
//     // if (this.location)
//     //     this.locationHistory.push(this.location);
//     // next();
// });

// UserSchema.post('save', function (error, doc, next) {
//     if (error.name == "BulkWriteError" || error.name === 'MongoError' && error.code === 11000) {
//         next(new Error('Este registro ja existe!'));
//     } else {
//         next(error);
//     }
// });

// Validations
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.methods.validPassword = function (hash, password) {
    return bcrypt.compareSync(password, hash);
};

export const User = mongoose.model('User', UserSchema);