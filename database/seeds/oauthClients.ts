import { OAuthClient } from '../../models/oauth-client.model'

const OAuthClients = [
    new OAuthClient({
        name: 'KOA 2',
        clientId: 'typescript-koa',
        clientSecret: 'typescript@koa',
        grants: ['client_credentials', 'refresh_token', 'authorization_code', 'password'],
        redirectUris: ['http://localhost:3000/oauth2/callback'],
        accessTokenLifetime: 60 * 60, // 1 hour 
        refreshTokenLifetime: 60 * 60 * 24 * 7, // 1 week  
        scope: 'account edit admin'
    })
]

export { OAuthClients };
