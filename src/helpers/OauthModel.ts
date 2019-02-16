import { OAuthClientModel, IOAuthClient } from "../models/oauth-client.model";
import { OAuthTokenModel } from "../models/oauth-token.model";
import { OAuthCodeModel } from "../models/oauth-code.model";
import { Client, Falsey, Token } from "oauth2-server";
import { AccountModel, IAccount } from "../models/account.model";
import { createHash, randomBytes } from "crypto";

class OAuthModel {
  async getClient(
    clientId: string,
    clientSecret: string
  ): Promise<IOAuthClient | Falsey> {
    console.log("getClient");

    let params = { clientId: clientId };
    if (clientSecret) {
      params = Object.assign({}, { clientSecret: clientSecret }, params);
    }

    let oauthclient = await OAuthClientModel.findOne(params);
    return oauthclient;
  }

  getUserFromClient(client) {
    console.log("getUserFromClient");
    return AccountModel.findOne({ _id: client.account });
  }

  async getRefreshToken(refreshToken: string) {
    console.log("getRefreshToken");

    let oauthtoken = await OAuthTokenModel.findOne({
      refreshToken: refreshToken
    }).populate("client");

    return Object.assign(
      {},
      { user: oauthtoken.account },
      oauthtoken.toObject()
    );
  }

  async getUser(username: string, password: string, next: Function) {
    console.log("getUser");
    AccountModel.findOne(
      {
        email: username.toLowerCase()
      },
      (err, user: any) => {
        if (err) return next(err);

        if (!user) {
          return next();
        }

        var userOBJ = user.toObject();
        if (userOBJ.hasOwnProperty("active"))
          if (!userOBJ.active) return next();

        if (
          !AccountModel.schema.methods.validPassword(user.password, password)
        ) {
          return next();
        }

        next(null, user);
      }
    );
  }

  async saveToken(
    token: Token,
    client: Client,
    account: IAccount
  ): Promise<any> {
    let accessToken = new OAuthTokenModel({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      client: client,
      clientId: client.clientId,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      account: account,
      scope: token.scope
    });

    accessToken = await accessToken.save();
    accessToken = accessToken.toObject();

    // para alterar o campo user para account
    // let model = Object.assign({}, { user: {id:account.id} }, );
    // model.account = account.id;


    return {
      accessToken: accessToken.accessToken,
      accessTokenExpiresAt: accessToken.accessTokenExpiresAt,
      refreshToken: accessToken.refreshToken,
      scope: accessToken.scope,
      client:accessToken.client,
      account:account.id,
      user:{id:account.id}
    };
  }

  grantTypeAllowed(clientId: string, grantType: string, next: Function) {
    console.log("grantTypeAllowed");
    if (["password"].indexOf(grantType) !== -1) {
      return next(false, true);
    }
  }

  saveAuthorizationCode(
    code: any,
    client: any,
    user: any
  ) {
    console.log("saveAuthorizationCode");
    let authCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      clientId: client.clientId,
      client: client,
      account: user
    };
    // next();
    return OAuthCodeModel.create(authCode).then(function(authorizationCode) {
      //  return authorizationCode;
      return {
        authorizationCode: authorizationCode.authorizationCode,
        expiresAt: authorizationCode.expiresAt,
        redirectUri: authorizationCode.redirectUri,
        scope: authorizationCode.scope,
        client: { id: authorizationCode.client.id },
        user: { id: authorizationCode.account }
      };
    });
  }

  getAuthorizationCode(authorizationCode) {
    console.log("getAuthorizationCode");
    return OAuthCodeModel.findOne({
      authorizationCode: authorizationCode
    }).then(function(code) {
      return {
        authorizationCode: code.authorizationCode,
        expiresAt: code.expiresAt,
        redirectUri: code.redirectUri,
        scope: code.scope,
        client: { id: code.client.toString() },
        user: code.account
      };
    });

  }

  revokeAuthorizationCode(code) {
    console.log("revokeAuthorizationCode");
    return OAuthCodeModel.deleteOne({
      authorizationCode: code.authorizationCode
    }).then(function(authorizationCode) {
      return !!authorizationCode;
    });
  }

  getAccessToken(bearerToken: string) {
    return OAuthTokenModel.findOne({ accessToken: bearerToken }).then(function(
      token
    ) {
      // Coloca o campo user para o oauth-server
      return Object.assign({}, { user: token.account }, token.toObject());
    });
  }

  revokeToken(token: Token, next: any) {
    console.log("revokeToken");
    OAuthTokenModel.findOneAndDelete(
      {
        accessToken: token.accessToken
      },
      next
    );
  }

  validateScope(user, client: Client, scope: string) {
    console.log("validateScope");
    if (scope && !scope.split(" ").every(s => client.scope.split(" ").indexOf(s) >= 0)) {
      return false;
    }
    return scope;
  }
  verifyScope(token: Token, scope) {
    console.log("verifyScope");
    if (!token.scope) {
      return false;
    }
    let requestedScopes = scope.split(" ");
    let authorizedScopes = (token.scope as string).split(" "); // token.scope.split(' ');

    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
  }

  // Helpers _ Se o tken for muito grante crash no grant_type=authorization_code
  // generateAccessToken(client, user, scope) {
  //   return this.generateRandomToken();
  // }
  // generateRefreshToken(client, user, scope) {
  //   return this.generateRandomToken();
  // }
  // generateAuthorizationCode(client, user, scope) {
  //   return this.generateRandomToken();
  // }
  // generateRandomToken() {
  //   let buffer = randomBytes(256);
  //   return createHash("sha512WithRSAEncryption")
  //     .update(buffer)
  //     .digest("hex");
  // }
}

export const oAuthModel = new OAuthModel();
