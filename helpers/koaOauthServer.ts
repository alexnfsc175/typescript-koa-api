import * as OAuth2Server from 'oauth2-server';
import { ExtensionModel, ServerOptions, Request, Response, OAuthError, InvalidScopeError, InvalidArgumentError, UnauthorizedRequestError, InvalidTokenError, InsufficientScopeError, InvalidClientError } from 'oauth2-server';
import * as Debug from 'debug';

// const debug = require('debug')('koa:oauth2-server'),
// OAuthServer = require('oauth2-server'),
// Request = OAuthServer.Request,
// Response = OAuthServer.Response;

// const ePath = 'oauth2-server/lib/errors/',
// OAuthError = require(ePath + 'oauth-error'),
// InvalidScopeError = require(ePath + 'invalid-scope-error'),
// InvalidArgumentError = require(ePath + 'invalid-argument-error'),
// UnauthorizedRequestError = require(ePath + 'unauthorized-request-error');

//ALex Errors
// const InvalidTokenError = require(ePath + 'invalid-token-error'),
//     InsufficientScopeError = require(ePath + 'insufficient-scope-error'),
//     InvalidClientError = require(ePath + 'invalid-client-error');

export class KoaOAuthServer {
    debug = Debug('koa:oauth2-server');
    options: any;
    server: OAuth2Server;
    saveTokenMetadata: Function;
    verifyScope: Function;


    // Expose error classes
    OAuthError = OAuthError;
    InvalidScopeError = InvalidScopeError;
    InvalidArgumentError = InvalidArgumentError;
    UnauthorizedRequestError = UnauthorizedRequestError;


    constructor(options: any) {
        this.options = options;

        if (!options.model) {
            throw new InvalidArgumentError('Missing parameter: `model`');
        }

        // If no `saveTokenMetadata` method is set via the model, we create
        // a simple passthrough mechanism instead
        this.saveTokenMetadata = options.model.saveTokenMetadata ?
            options.model.saveTokenMetadata :
            (token, data) => {
                return Promise.resolve(token);
            };

        // If no `checkScope` method is set via the model, we provide a default
        this.verifyScope = options.model.verifyScope ?
            options.model.verifyScope :
            (scope, token) => {
                return token.scope.indexOf(scope) !== -1;
            }

        this.server = new OAuth2Server(options);
    }

    // Returns token authentication middleware
    authenticate(options) {
        this.debug('Creating authentication endpoint middleware');
        return async (ctx, next) => {
            this.debug('Running authenticate endpoint middleware');
            const request = new Request(ctx.request),
                response = new Response(this.fixHeaders(ctx.response));

            await this.server
                .authenticate(request, response, options)
                .then(async (token) => {
                    ctx.state.oauth = {
                        token: token
                    };
                    await next();
                })
                .catch((err) => {
                    this.handleError(err, ctx);
                });
        };
    }

    // Returns authorization endpoint middleware
    // Used by the client to obtain authorization from the resource owner
    authorize(options) {
        this.debug('Creating authorization endpoint middleware');
        return async (ctx, next) => {
            this.debug('Running authorize endpoint middleware');
            //

            //
            const request = new Request(ctx.request),
                response = new Response(this.fixHeaders(ctx.response));

            await this.server
                .authorize(request, response, options)
                .then(async (code) => {
                    ctx.state.oauth = {
                        code: code
                    };
                    this.handleResponse(ctx, response);
                    await next();
                })
                .catch((err) => {
                    this.handleError(err, ctx);
                });
        };
    }

    // Returns token endpoint middleware
    // Used by the client to exchange authorization grant for access token
    token() {
        this.debug('Creating token endpoint middleware');
        return async (ctx, next) => {
            this.debug('Running token endpoint middleware');
            const request = new Request(ctx.request),
                response = new Response(this.fixHeaders(ctx.response));

            await this.server
                .token(request, response)
                .then((token) => {
                    return this.saveTokenMetadata(token, ctx.request);
                })
                .then(async (token) => {
                    ctx.state.oauth = {
                        token: token
                    };
                    this.handleResponse(ctx, response);
                    // await next();
                })
                .catch((err) => {
                    this.handleError(err, ctx);
                });
        };
    }

    // Returns scope check middleware
    // Used to limit access to a route or router to carriers of a certain scope.
    scope(required) {
        this.debug(`Creating scope check middleware (${required})`);
        return (ctx, next) => {
            const result = this.verifyScope(ctx.state.oauth.token, required);
            if (result !== true) {
                const err = result === false ?
                    `Required scope: \`${required}\`` :
                    result;

                this.handleError(new InvalidScopeError(err), ctx);
                return;
            }

            return next();
        };
    }

    //HANDLES
    handleResponse = (ctx, response) => {
        this.debug(`Preparing success response (${response.status})`);
        ctx.set(response.headers);
        ctx.status = response.status;
        ctx.body = response.body;
    }

    // Add custom headers to the context, then propagate error upwards
    private handleError(err, ctx) {
        this.debug(`Preparing error response (${err.code || 500})`);

        const response = new Response(this.fixHeaders(ctx.response));
        ctx.set(response.headers);

        ctx.status = err.code || 500;
        //Alex
        if (this.isOAuthError(err)) {
            ctx.body = {
                error: err.name,
                error_description: err.message
            };
        }

        ctx.app.emit('error', err, ctx);
    }

    private isOAuthError(err) {
        return err instanceof InvalidScopeError ||
            err instanceof InsufficientScopeError ||
            err instanceof InvalidClientError ||
            err instanceof InvalidTokenError ||
            err instanceof UnauthorizedRequestError;

    }

    private fixHeaders(response) {
        const NewResponse = {
            headers: {}
        };
        const res = response
        for (var property in res) {
            if (res.hasOwnProperty(property) && !NewResponse[property]) {
                NewResponse[property] = res[property];
            }
        }
        for (var field in res.headers) {
            NewResponse.headers[field.toLowerCase()] = res.headers[field];
        }
        return NewResponse;
    }
}



// module.exports = KoaOAuthServer;

