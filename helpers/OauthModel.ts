import { OAuthClient } from '../models/oauth-client.model'
import { OAuthToken } from '../models/oauth-token.model'
import { Client, Falsey, Token } from 'oauth2-server';
import { Document } from 'mongoose'
import { User } from '../models/user.model'


class OAuthModel {
    async getClient(clientId: string, clientSecret: string, next: Function): Promise<Client | Falsey> {
        console.log('getClient');
        return OAuthClient.findOne({
            clientId: clientId,
            clientSecret: clientSecret
        }, next).lean().exec(function (err, doc) {

            if (err) return null;
            if (!doc) return null;

            doc.id = doc._id.toString();

            return doc;
        });
    }

    async getRefreshToken(refreshToken: string) {
        console.log('getRefreshToken');
        // return OAuthToken.findOne({
        //     refreshToken: refreshToken
        // }).lean().exec(function (err, doc) {

        //     if (err) return null;
        //     if (!doc) return null;

        //     doc.id = doc._id.toString();

        //     return doc;
        // });
        return await OAuthToken.findOne({
            refreshToken: refreshToken
        }).lean();
    }

    async getUser(username: string, password: string, next: Function) {
        console.log('getUser');
        User.findOne({
            email: username.toLowerCase()
        }, (err, user: any) => {
            if (err) return next(err);

            if (!user) {
                return next();
            }

            var userOBJ = user.toObject();
            if (userOBJ.hasOwnProperty('active'))
                if (!userOBJ.active)
                    return next();

            if (!User.schema.methods.validPassword(user.password, password)) {
                return next();
            }

            next(null, user);
        });
        // return User.findOne({ username: username, password: password }).lean();
    }

    saveToken(token: Token, client: Client, user: any) {
        console.log('saveToken');

        var accessToken = new OAuthToken({
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            client: client,
            clientId: client.clientId,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            user: user,
            scope: token.scope,
            userId: user._id ? user._id : user,
        });

        // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.

        return new Promise(function (resolve, reject) {
            accessToken.save(function (err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        }).then(function (saveResult: Document) {
            // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
            saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;

            // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
            // var data = new Object();
            // for (var prop in saveResult) {
            //     if (['client', 'clientId', 'user', 'userId'].indexOf(prop) > -1)
            //         data[prop] = saveResult[prop]
            // };

            // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
            // data.client = data.clientId;
            // data.user = data.userId;

            // return data;
            return saveResult;
        });
    }

    grantTypeAllowed(clientId: string, grantType: string, next: Function) {
        console.log('grantTypeAllowed');
        if (['password'].indexOf(grantType) !== -1) {
            return next(false, true);
        }
    }

    saveAuthorizationCode(token: string, clientId: string, expires, userId: String, next: any) {
        console.log('saveAuthorizationCode');
        var accessToken = new OAuthToken({
            accessToken: token,
            clientId: clientId,
            user: userId,
            expires: expires
        });

        accessToken.save(next);
    }

    getAccessToken(bearerToken: string, next: Function) {
        console.log('getAccessToken');
        OAuthToken.findOne({
            accessToken: bearerToken
        }, next);
    };

    revokeToken(token: Token, next: any) {
        console.log('revokeToken');
        OAuthToken.findOneAndRemove({
            accessToken: token.accessToken
        }, next);
    }

    validateScope(user, client: Client, scope: string) {
        console.log('validateScope');
        // return (user.scope === scope && client.scope === scope && scope !== null) ? scope : false

        if (!scope.split(' ').every(s => client.scope.split(' ').indexOf(s) >= 0)) {
            return false;
        }
        return scope;

        //Parciais
        // return scope
        //     .split(' ')
        //     .filter(s => VALID_SCOPES.indexOf(s) >= 0)
        //     .join(' ');
    }
    verifyScope(token: Token, scope) {
        console.log('verifyScope');
        // debug(`Verify scope ${scope} in token ${token.accessToken}`);
        // if(scope && !token.scope) { return false; }
        // return token;

        //Documentação 
        if (!token.scope) {
            return false;
        }
        let requestedScopes = scope.split(' ');
        let authorizedScopes = token.scope.split(' ');
        return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
    };
}

export const oAuthModel = new OAuthModel();
//
// model.getClient = function (clientId, clientSecret, next) {
//     // console.log('getClient');
//     return OAuthClient.findOne({
//         clientId: clientId,
//         clientSecret: clientSecret
//     }, next).lean().exec(function (err, doc) {

//         if (err) return null;
//         if (!doc) return null;

//         doc.id = doc._id.toString();

//         return doc;
//     });
// };

/**
 * Get refresh token.
 */

// model.getRefreshToken = async function (refreshToken) {
//     // console.log('getRefreshToken');
//     // return OAuthToken.findOne({
//     //     refreshToken: refreshToken
//     // }).lean().exec(function (err, doc) {

//     //     if (err) return null;
//     //     if (!doc) return null;

//     //     doc.id = doc._id.toString();

//     //     return doc;
//     // });
//     return await OAuthToken.findOne({
//         refreshToken: refreshToken
//     }).lean();
// };

// model.getUser = function (username, password, next) {
//     // console.log('getUser');
//     User.findOne({
//         email: username.toLowerCase()
//     }, function (err, user) {
//         if (err) return next(err);

//         if (!user) {
//             return next();
//         }

//         var userOBJ = user.toObject();
//         if (userOBJ.hasOwnProperty('active'))
//             if (!userOBJ.active)
//                 return next();

//         if (!User.schema.methods.validPassword(user.password, password)) {
//             return next();
//         }

//         next(null, user);
//     });
//     // return User.findOne({ username: username, password: password }).lean();
// };

// model.saveToken = function (token, client, user) {
//     // console.log('saveToken');

//     var accessToken = new OAuthToken({
//         accessToken: token.accessToken,
//         accessTokenExpiresAt: token.accessTokenExpiresAt,
//         client: client,
//         clientId: client.clientId,
//         refreshToken: token.refreshToken,
//         refreshTokenExpiresAt: token.refreshTokenExpiresAt,
//         user: user,
//         scope: token.scope,
//         userId: user._id ? user._id : user,
//     });

//     // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.

//     return new Promise(function (resolve, reject) {
//         accessToken.save(function (err, data) {
//             if (err) reject(err);
//             else resolve(data);
//         });
//     }).then(function (saveResult) {
//         // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
//         saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;

//         // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
//         var data = new Object();
//         for (var prop in saveResult) data[prop] = saveResult[prop];

//         // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
//         data.client = data.clientId;
//         data.user = data.userId;

//         return data;
//     });
// };


// model.grantTypeAllowed = function (clientId, grantType, next) {
//     // console.log('grantTypeAllowed');
//     if (['password'].indexOf(grantType) !== -1) {
//         return next(false, true);
//     }
// };

// model.saveAuthorizationCode = function (token, clientId, expires, userId, next) {
//     // console.log('saveAuthorizationCode');
//     var accessToken = new OAuthToken({
//         accessToken: token,
//         clientId: clientId,
//         user: userId,
//         expires: expires
//     });

//     accessToken.save(next);
// };

// model.getAccessToken = function (bearerToken, next) {
//     // console.log('getAccessToken');
//     OAuthToken.findOne({
//         accessToken: bearerToken
//     }, next);
// };

// model.revokeToken = (token, next) => {
//     // console.log('revokeToken');
//     OAuthToken.findOneAndRemove({
//         accessToken: token.accessToken
//     }, next);
// }

// model.validateScope = (user, client, scope) => {
//     // console.log('validateScope', user, client, scope);
//     // return (user.scope === scope && client.scope === scope && scope !== null) ? scope : false

//     if (!scope.split(' ').every(s => client.scope.split(' ').indexOf(s) >= 0)) {
//         return false;
//     }
//     return scope;

//     //Parciais
//     // return scope
//     //     .split(' ')
//     //     .filter(s => VALID_SCOPES.indexOf(s) >= 0)
//     //     .join(' ');
// }
// model.verifyScope = (token, scope) => {
//     // debug(`Verify scope ${scope} in token ${token.accessToken}`);
//     // if(scope && !token.scope) { return false; }
//     // return token;

//     //Documentação 
//     if (!token.scope) {
//         return false;
//     }
//     let requestedScopes = scope.split(' ');
//     let authorizedScopes = token.scope.split(' ');
//     return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
// };