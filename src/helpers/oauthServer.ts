// const oauthserver = require('ubx-koa2-oauth2-server');
// const oauthserver = require('oauth2-server');
// const oauthserver = require('./koaOauthServer');
import { KoaOAuthServer } from './koaOauthServer'
import { oAuthModel } from './OauthModel';

export const oauthServer = new KoaOAuthServer({
    scope: 'user.operational.finance.admin', // Alternatively string with required scopes (see verifyScope)
    model: oAuthModel,
    grants: ['password','authorization_code','refresh_token'],
    debug: false,
    accessTokenLifetime: 604800, //7 days
    refreshTokenLifetime: 604800, //7 days

    allowBearerTokensInQueryString: true, 
    addAcceptedScopesHeader: true,
    addAuthorizedScopesHeader: true,
});