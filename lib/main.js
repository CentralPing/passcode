/**
 * @module passcode
*/

const {sign: jwtSign, verify: jwtVerify} = require('jsonwebtoken');
const {pbkdf2Sync} = require('crypto');
const {v4} = require('uuid');

const {randomCode} = require('./random-code');
const {filter: filterObject} = require('./filter');

const CODE_KEY = '$CPPC';
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
 * @param {Date} [payload.iat=Date.now] JWT issue timestamp.
 * @param {Date} [payload.jti=uuid] JWT ID (should be unique).
 * @param {Object} claims
 * @param {String} claims.secret A string to sign the JWT.
 * @param {String} [claims.issuer] JWT issuer (used as additional verification).
 * @param {String} [claims.subject] JWT subject (used as additional
 *  verification).
 * @param {String} [claims.audience] JWT audience (used as additional
 *  verification).
 * @param {String} [claims.expiresIn=5m] JWT expiration value.
 * @param {Object} hash
 * @param {String} hash.salt A string to salt the challenge code
 *  hash.
 * @param {Number} [hash.codeLength=6] Length of numeric code to issue
 *  (max 14).
 * @param {Number} [hash.iterations=1000] Iterations for hash.
 * @param {Number} [hash.keyLength=64] Length of hash.
 * @param {String} [hash.digest=sha512] Hashing algorithm.
 * @param {String} [hash.encoding=hex] Hash encoding.
 * @return {Object} `{error, value: {id, expires, code, token}}`
 */
function issue(
  {
    iat = Math.floor(Date.now() / 1000),
    jti = v4(),
    ...payload
  } = {},
  {
    secret,
    issuer,
    subject,
    audience,
    expiresIn = EXPIRES_IN,
    ...claims
  } = {},
  {
    salt,
    codeLength = CODE_LENGTH,
    iterations = ITERATIONS,
    keyLength = KEY_LENGTH,
    digest = DIGEST,
    encoding = ENCODING
  } = {}
) {
  try {
    const code = randomCode(codeLength);
    const challenge = pbkdf2Sync(
      code,
      salt,
      iterations,
      keyLength,
      digest
    ).toString(encoding);
    const tokenPayload = filterObject({
      ...payload,
      iat,
      jti,
      [CODE_KEY]: challenge
    }, ([key, value]) => value !== undefined);
    const tokenClaims = filterObject({
      ...claims,
      issuer,
      subject,
      audience,
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
    return {error, value: undefined};
  }
}

/**
 * Verifies an issued token with the provided challenge code
 * @example
 * const tokenInfo = verify(token, challengeCode);
 * @param {String} token The token to be verified
 * @param {Object} claims
 * @param {String} [claims.code=''] The challenge code.
 * @param {String} claims.secret A string to sign the JWT.
 * @param {String} [claims.issuer] JWT issuer (used as additional verification).
 * @param {String} [claims.subject] JWT subject (used as additional
 *  verification).
 * @param {String} [claims.audience] JWT audience (used as additional
 * @param {Object} hash
 * @param {String} hash.salt A string to salt the challenge code
 *  hash.
 * @param {Number} [hash.iterations=1000] Iterations for hash.
 * @param {Number} [hash.keyLength=64] Length of hash.
 * @param {String} [hash.digest=sha512] Hashing algorithm.
 * @param {String} [hash.encoding=hex] Hash encoding.
 * @return {Object} `{error, value: {iat, jti, exp, ...TOKEN_INFO}}`
 */
function verify(
  token,
  {
    code = '',
    secret,
    issuer,
    subject,
    audience
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
    const decoded = jwtVerify(
      token,
      secret,
      {
        issuer,
        subject,
        audience
      }
    );
    const challenge = pbkdf2Sync(
      code,
      salt,
      iterations,
      keyLength,
      digest
    ).toString(encoding);

    if (decoded[CODE_KEY] !== challenge) {
      throw new Error('Invalid challenge code');
    }

    delete decoded[CODE_KEY];

    return {error: null, value: decoded};
  } catch (error) {
    return {error, value: undefined};
  }
}
