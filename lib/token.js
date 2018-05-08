/**
 * @module passcode
*/

const {sign: jwtSign, verify: jwtVerify} = require('jsonwebtoken');
const {pbkdf2Sync} = require('crypto');
const {v4} = require('uuid');

const {randomCode} = require('./random-code');
const {filter: filterObject} = require('./filter');

const CODE_KEY = '$CPPC';

const config = {
  issuer: undefined,
  subject: undefined,
  audience: undefined,
  salt: v4(),
  iterations: 1000,
  keyLength: 64,
  digest: 'sha512',
  encoding: 'hex',
  secret: v4(),
  codeLength: 6,
  expiresIn: '5m'
};

exports.config = config;
exports.issue = issue;
exports.verify = verify;

/**
 * Issues an object containing the stringified challenge code, token ID,
 *  and token
 * @example
 * const challengeTokenInfo = issue({email: 'foo@bar.com'});
 * @param {Object} payload
 * @param {Object} claims
 * @return {Object} Contains the stringified challenge code, token ID, and token
 */
function issue(
  {
    iat = Math.floor(Date.now() / 1000),
    jti = v4(),
    ...payload
  } = {},
  {
    secret = config.secret,
    issuer = config.issuer,
    subject = config.subject,
    audience = config.audience,
    expiresIn = config.expiresIn,
    ...claims
  } = {},
  {
    codeLength = config.codeLength,
    salt = config.salt,
    iterations = config.iterations,
    keyLength = config.keyLength,
    digest = config.digest,
    encoding = config.encoding
  } = {}
) {
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
    id: jti,
    expires: tokenPayload.exp,
    token,
    code
  };
}

/**
 * Verifies an issued token with the provided challenge code
 * @example
 * const tokenInfo = verify(token, challengeCode);
 * @param {String} token The token to be verified
 * @param {Object} verifications The challenge code to verify the token
 * @return {Object} The decoded token
 */
function verify(
  token,
  {
    code = '',
    secret = config.secret,
    issuer = config.issuer,
    subject = config.subject,
    audience = config.audience
  } = {},
  {
    salt = config.salt,
    iterations = config.iterations,
    keyLength = config.keyLength,
    digest = config.digest,
    encoding = config.encoding
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

    return decoded;
  } catch (err) {
    throw err;
  }
}
