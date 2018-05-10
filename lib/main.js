/**
 * @module passcode
*/

const {sign: jwtSign, verify: jwtVerify} = require('jsonwebtoken');
const {pbkdf2Sync} = require('crypto');
const {v4} = require('uuid');

const {randomCode} = require('./random-code');
const {filter: filterObject} = require('./filter');

const ITERATIONS = 1000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';
const ENCODING = 'hex';
const CODE_LENGTH = 6;
const EXPIRES_IN = '5m';

exports.issue = issue;
exports.verify = verify;

/**
 * Issues a token, token ID, expiration and the stringified challenge code.
 * @example
 * const {value: {id, expires, code, token}} = issue(
 *   {email: 'foo@bar.com'},
 *   {secret},
 *   {salt}
 * );
 * @param {Object} [payload]
 * @param {Date} [payload.jti=uuid] JWT ID (should be unique).
 * @param {Object} claims
 * @param {String} claims.secret A string to sign the JWT.
 * @param {String} [claims.code] The challenge code (defaults to
 *  random 6 digit string).
 *  verification).
 * @param {(Number|String)} [claims.expiresIn=5m] JWT expiration time span.
 *  In seconds or a parsable string for [zeit/ms](https://github.com/zeit/ms)
 * @param {Object} hash
 * @param {String} [hash.salt] A string to salt the challenge code
 *  hash. If undefined then the code will not be hashed.
 * @param {Number} [hash.iterations=1000] Iterations for hash.
 * @param {Number} [hash.keyLength=64] Length of hash.
 * @param {String} [hash.digest=sha512] Hashing algorithm.
 * @param {String} [hash.encoding=hex] Hash encoding.
 * @return {Object} `{error, value: {id, expires, code, token}}`
 */
function issue(
  {
    jti = v4(),
    ...payload
  } = {},
  {
    secret,
    code = randomCode(CODE_LENGTH),
    expiresIn = EXPIRES_IN,
    ...claims
  } = {},
  {
    salt,
    iterations = ITERATIONS,
    keyLength = KEY_LENGTH,
    digest = DIGEST,
    encoding = ENCODING
  } = {}
) {
  try {
    const challenge = salt === undefined ?
      code :
      pbkdf2Sync(
        code,
        salt,
        iterations,
        keyLength,
        digest
      ).toString(encoding);
    const tokenPayload = filterObject({
      ...payload,
      jti,
      $CPPC: challenge
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
        code
      }
    };
  } catch (error) {
    return {error};
  }
}

/**
 * Verifies an issued token with the provided challenge code
 * @example
 * const tokenInfo = verify(token, challengeCode);
 * @param {String} token The token to be verified
 * @param {Object} claims
 * @param {String} claims.code The challenge code.
 * @param {String} claims.secret A string to sign the JWT.
 * @param {String} [claims.iss] JWT issuer (used as additional verification).
 * @param {String} [claims.aud] JWT audience (used as additional
 * @param {String} [claims.sub] JWT subject (used as additional
 *  verification).
 * @param {Object} hash
 * @param {String} [hash.salt] A string to salt the challenge code
 *  hash. If undefined then the code will not be hashed.
 * @param {Number} [hash.iterations=1000] Iterations for hash.
 * @param {Number} [hash.keyLength=64] Length of hash.
 * @param {String} [hash.digest=sha512] Hashing algorithm.
 * @param {String} [hash.encoding=hex] Hash encoding.
 * @return {Object} `{error, value: {iat, jti, exp, ...TOKEN_INFO}}`
 */
function verify(
  token,
  {
    code,
    secret,
    iss: issuer,
    aud: audience,
    sub: subject
  } = {},
  {
    salt,
    iterations = ITERATIONS,
    keyLength = KEY_LENGTH,
    digest = DIGEST,
    encoding = ENCODING
  } = {}
) {
  try {
    const {$CPPC, ...decoded} = jwtVerify(
      token,
      secret,
      {
        issuer,
        audience,
        subject
      }
    );
    const challenge = salt === undefined ?
      code :
      pbkdf2Sync(
        code,
        salt,
        iterations,
        keyLength,
        digest
      ).toString(encoding);

    if ($CPPC !== challenge) {
      throw new Error('Invalid challenge code');
    }

    return {error: null, value: decoded};
  } catch (error) {
    return {error};
  }
}
