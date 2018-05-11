/**
 * @module passcode
*/

const {sign: jwtSign, verify: jwtVerify} = require('jsonwebtoken');
const {pbkdf2Sync} = require('crypto');
const {v4} = require('uuid');

const {randomCode} = require('./random-code');
const {filter: filterObject} = require('./filter');

const CODE_PROP = '$CPPC';
const ITERATIONS = 1000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';
const ENCODING = 'hex';
const CODE_LENGTH = 6;
const EXPIRES_IN = '5m';

exports.issue = issue;
exports.verify = verify;

/**
 * Issues a signed token with a hashed passcode, token ID, expiration time
 *  and the stringified passcode.
 * @example
 * const {error, value} = issue({salt, secret}, {email: 'foo@bar.com'});
 * @param {Object} security
 * @param {String} security.salt A string to salt the passcode hash.
 * @param {String} security.secret A string to sign the JWT.
 * @param {String} [security.passcode] The passcode (defaults to random
 *  6 digit string).
 * @param {String} [security.iss] JWT issuer (used as additional verification).
 * @param {String} [security.aud] JWT audience (used as additional
 *  verification).
 * @param {String} [security.sub] JWT subject (used as additional
 *  verification).
 * @param {Object} [payload] Essentially a passthrough for [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
 *  payload support.
 * @param {Date} [payload.jti] JWT ID (defaults to a [`uuid.v4`](https://github.com/kelektiv/node-uuid#version-4) value).
 * @param {Object} claims Essentially a passthrough for [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
 *  claims support.
 * @param {(Number|String)} [claims.expiresIn=5m] JWT expiration time span.
 *  In seconds or a parsable string for [zeit/ms](https://github.com/zeit/ms)
 * @param {Object} hash Essentially a passthrough for [`pbkdf2`](https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest)
 *  hashing options.
 * @param {Number} [hash.iterations=1000] Hash iterations.
 * @param {Number} [hash.keyLength=64] Hash length.
 * @param {String} [hash.digest=sha512] Hashing algorithm.
 * @param {String} [hash.encoding=hex] Hash encoding.
 * @return {Object} `{error, value: {id, expires, passcode, token}}`
 */
function issue(
  {
    passcode = randomCode(CODE_LENGTH),
    salt = new TypeError('"salt" is required'),
    secret = new TypeError('"secret" is required'),
    iss,
    aud,
    sub
  } = {},
  {
    jti = v4(),
    ...payload
  } = {},
  {
    expiresIn = EXPIRES_IN,
    ...claims
  } = {},
  {
    iterations = ITERATIONS,
    keyLength = KEY_LENGTH,
    digest = DIGEST,
    encoding = ENCODING
  } = {}
) {
  try {
    if (salt instanceof Error) throw salt;
    if (secret instanceof Error) throw secret;

    const challenge = pbkdf2Sync(
      passcode,
      salt,
      iterations,
      keyLength,
      digest
    ).toString(encoding);
    const tokenPayload = filterObject({
      iss,
      aud,
      sub,
      ...payload,
      jti,
      [CODE_PROP]: challenge
    }, ([key, value]) => value !== undefined);
    const tokenClaims = filterObject({
      ...claims,
      expiresIn,
      mutatePayload: true
    }, ([key, value]) => value !== undefined);
    const token = jwtSign(tokenPayload, secret, tokenClaims);

    return {
      error: null,
      value: {
        id: jti,
        expires: tokenPayload.exp,
        token,
        passcode
      }
    };
  } catch (error) {
    return {error};
  }
}

/**
 * Verifies a signed token with the provided challenge passcode.
 * @example
 * const {error, value} = verify(token, {passcode, salt, secret});
 * @param {String} token The token to be verified
 * @param {Object} security
 * @param {String} security.passcode The challenge passcode.
 * @param {String} security.salt A string to salt the challenge passcode hash.
 * @param {String} security.secret A string to verify the JWT.
 * @param {String} [security.iss] JWT issuer (used as additional verification).
 * @param {String} [security.aud] JWT audience (used as additional
 *  verification).
 * @param {String} [security.sub] JWT subject (used as additional
 *  verification).
 * @param {Object} hash Essentially a passthrough for [`pbkdf2`](https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest)
 *  hashing options.
 * @param {Number} [hash.iterations=1000] Hash iterations.
 * @param {Number} [hash.keyLength=64] Hash length.
 * @param {String} [hash.digest=sha512] Hashing algorithm.
 * @param {String} [hash.encoding=hex] Hash encoding.
 * @return {Object} `{error, value: {iat, jti, exp, ...TOKEN_PAYLOAD}}`
 */
function verify(
  token = new TypeError('"token" is required'),
  {
    passcode = new TypeError('"passcode" is required'),
    salt = new TypeError('"salt" is required'),
    secret = new TypeError('"secret" is required'),
    iss: issuer,
    aud: audience,
    sub: subject
  } = {},
  {
    iterations = ITERATIONS,
    keyLength = KEY_LENGTH,
    digest = DIGEST,
    encoding = ENCODING
  } = {}
) {
  try {
    if (token instanceof Error) throw token;
    if (passcode instanceof Error) throw passcode;
    if (salt instanceof Error) throw salt;
    if (secret instanceof Error) throw secret;

    const {[CODE_PROP]: $CPPC, ...decoded} = jwtVerify(
      token,
      secret,
      {
        issuer,
        audience,
        subject
      }
    );
    const challenge = pbkdf2Sync(
      passcode,
      salt,
      iterations,
      keyLength,
      digest
    ).toString(encoding);

    if ($CPPC !== challenge) {
      throw new Error('Invalid challenge passcode');
    }

    return {error: null, value: decoded};
  } catch (error) {
    return {error};
  }
}
