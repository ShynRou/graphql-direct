const jwt = require('jsonwebtoken');

/**
 * @param username
 * @param password
 * @param loginValidator: (username, password) => string[] // return value is the users scopes, null/false/undefined === failed
 * @return {{login: login}}
 */
module.exports.login = (username, password, loginValidator) => {
  const scope = loginValidator(username, password);

  if (scope) {
    if (!global.config.auth.secret)
      throw 'SECURITY CRASH: auth private key is not set';

    return jwt.sign(
      {
        username,
        scope,
        exp: Math.floor(Date.now() / 1000) + (global.config.auth.ttl || (60 * 60 * 24)),
      },
      global.config.auth.secret
    );
  }
  else {
    return false;
  }
};

module.exports.verify = (token) => {
  if (!global.config.auth.secret)
    throw 'SECURITY CRASH: auth private key is not set';

  try {
    return jwt.verify(token, global.config.auth.secret);
  }
  catch (e) {
    console.error(e);
  }
};

module.exports.guard = (allowedScopes, callback) => {
  return (source, args, context, info) => {
    if (allowedScopes && allowedScopes.length > 0) {
      if (context
        && context.token
        && context.context.token.scope
        && context.context.token.scope.length > 0
        && !!context.context.token.scope.find((value) => allowedScopes.indexOf(value) >= 0)) {
        return callback(source, args, context, info);
      }
      return false;
    }

    if(context.token) {
      return callback(source, args, context, info);
    }
    else {
      return false;
    }
  };
};