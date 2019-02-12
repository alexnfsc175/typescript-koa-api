   ## OauthCode
 #### Atualizar token, redirect_ur 
    curl --get -v \
    –noproxy \
    'localhost:4955/oauth/authorize' \
    -H "Authorization: Bearer a41c60a4c85632f38138c72b26b09cf83c7b806d" \
    -A 'curl/7.19.6 Rcurl/1.95.4.1 httr/1.3.1' \
    --data-urlencode "client_id=typescript-koa" \
    --data-urlencode "response_type=code" \
    --data-urlencode "state=Alguma informacao para ser repassada" \
    --data-urlencode "redirect_uri=http://localhost:4955/oauth/callback"


  curl http://localhost:4955/oauth/token \
        -d "grant_type=password" \
        -d "username=admin@admin.com.br" \
        -d "password=linux123" \
        -d "client_id=typescript-koa" \
        -d "client_secret=typescript@koa" \
        -d "scope=admin" \
        -H "Content-Type: application/x-www-form-urlencoded"

    curl http://localhost:4955/oauth/token \
	    -d "grant_type=client_credentials" \
	    -d "client_id=typescript-koa" \
      -d "client_secret=typescript@koa" \
      -d "scope=admin" \
	    -H "Content-Type: application/x-www-form-urlencoded"


typescript-koa:typescript@koa | bas64

curl http://localhost:4955/oauth/token \
	-d "grant_type=password" \
	-d "username=admin@admin.com.br" \
	-d "password=linux123" \
	-H "Authorization: Basic dHlwZXNjcmlwdC1rb2E6dHlwZXNjcmlwdEBrb2EK" \
	-H "Content-Type: application/x-www-form-urlencoded"

dHlwZXNjcmlwdC1rb2E6dHlwZXNjcmlwdEBrb2EK


    ==========================================
    getClient

getRefreshToken

revokeToken

verifyScope

getUser

validateScope



##########################

# getClient
# getRefreshToken
grantTypeAllowed
saveAuthorizationCode
getAccessToken
# revokeToken
# validateScope
# verifyScope


generateRandomToken: function() {
    return randomBytes(256).then(function(buffer) {
      return crypto
        .createHash('sha1')
        .update(buffer)
        .digest('hex');
    });
  }



https://github.com/mekentosj/oauth2-example/blob/master/models/oauth_authcode.js
https://github.com/jorguezz/oauth2-node-server/tree/master/models
https://resources.infosecinstitute.com/securing-web-apis-part-ii-creating-an-api-authenticated-with-oauth-2-in-node-js/#gref

curl –noproxy -H "Authorization: Bearer 1da0c799e68705a7247cfade4fe6c82c1723f584" localhost:4955 localhost:4955/oauth/authorize –data "client_id=typescript-koa&response_type=code&redirect_uri=http://www.infosecinstitute.com"