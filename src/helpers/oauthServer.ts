// const oauthserver = require('ubx-koa2-oauth2-server');
// const oauthserver = require('oauth2-server');
// const oauthserver = require('./koaOauthServer');
import { KoaOAuthServer } from './koaOauthServer'
import { oAuthModel } from './OauthModel';

export const oauthServer = new KoaOAuthServer({
    scope: 'account', // escopo de token necessario para qualquer requisição na aplicação
    model: oAuthModel,
    grants: ['password','authorization_code','refresh_token'],
    debug: true,
    accessTokenLifetime: 604800, //7 days
    refreshTokenLifetime: 604800, //7 days

    allowBearerTokensInQueryString: true, 
    allowExtendedTokenAttributes: true,
    addAcceptedScopesHeader: true,
    addAuthorizedScopesHeader: true,
});