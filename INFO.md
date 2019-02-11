   ## OauthCode
 #### Atualizar token, redirect_ur 
    curl --get -v \
    –noproxy \
    'localhost:4955/oauth/authorize' \
    -H "Authorization: Bearer e209dc1e740d8fd2b9a29b837d0e355639b1bb75" \
    -A 'curl/7.19.6 Rcurl/1.95.4.1 httr/1.3.1' \
    --data-urlencode "client_id=typescript-koa" \
    --data-urlencode "response_type=code" \
    --data-urlencode "state=Alguma informacao para ser repassada" \
    --data-urlencode "redirect_uri=http://localhost:4955/oauth/callback"



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