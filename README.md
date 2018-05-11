# @CentralPing/passcode

[![Build Status](https://travis-ci.org/CentralPing/passcode.svg?branch=master)](https://travis-ci.org/CentralPing/passcode)
[![Coverage Status](https://coveralls.io/repos/github/CentralPing/passcode/badge.svg)](https://coveralls.io/github/CentralPing/passcode)
[![Dependency Status](https://david-dm.org/CentralPing/passcode.svg)](https://david-dm.org/CentralPing/passcode)
[![Greenkeeper Status](https://badges.greenkeeper.io/CentralPing/passcode.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/centralping/passcode/badge.svg)](https://snyk.io/test/github/centralping/passcode)

A slightly opinionated stateless passcode manager.

Why *slightly* opinionated? Some people like more flexibility in how to implement solutions and this module hopefully allows for that. The few opinions employed in this module include the choice of hashing method, [`pbkdf2`](https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest) (can be configured), and a custom random 6 digit passcode generator (custom passcodes can be provided). The biggest opinion however is to enforce signing the JWT and hashing the passcode. Doing niether results in a extremely unsecure and effectively useless passcode verification as unsigned JWTs can be modified by anyone and unhashed codes can be read by anyone. If that is desired then this module is superflous as the underlying [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) module can handle that directly.

## Installation

`npm i --save https://github.com/CentralPing/passcode`

## API Reference

<a name="module_passcode..issue"></a>

### passcode~issue(security, [payload], claims, hash) ⇒ <code>Object</code>
Issues a signed token with a hashed passcode, token ID, expiration time
 and the stringified passcode.

**Kind**: inner method of [<code>passcode</code>](#module_passcode)  
**Returns**: <code>Object</code> - `{error, value: {id, expires, passcode, token}}`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| security | <code>Object</code> |  |  |
| security.salt | <code>String</code> |  | A string to salt the passcode hash. |
| security.secret | <code>String</code> |  | A string to sign the JWT. |
| [security.passcode] | <code>String</code> |  | The passcode (defaults to random  6 digit string). |
| [security.iss] | <code>String</code> |  | JWT issuer (used as additional verification). |
| [security.aud] | <code>String</code> |  | JWT audience (used as additional  verification). |
| [security.sub] | <code>String</code> |  | JWT subject (used as additional  verification). |
| [payload] | <code>Object</code> |  | Essentially a passthrough for [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)  payload support. |
| [payload.jti] | <code>Date</code> |  | JWT ID (defaults to a [`uuid.v4`](https://github.com/kelektiv/node-uuid#version-4) value). |
| claims | <code>Object</code> |  | Essentially a passthrough for [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)  claims support. |
| [claims.expiresIn] | <code>Number</code> \| <code>String</code> | <code>5m</code> | JWT expiration time span.  In seconds or a parsable string for [zeit/ms](https://github.com/zeit/ms) |
| hash | <code>Object</code> |  | Essentially a passthrough for [`pbkdf2`](https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest)  hashing options. |
| [hash.iterations] | <code>Number</code> | <code>1000</code> | Hash iterations. |
| [hash.keyLength] | <code>Number</code> | <code>64</code> | Hash length. |
| [hash.digest] | <code>String</code> | <code>sha512</code> | Hashing algorithm. |
| [hash.encoding] | <code>String</code> | <code>hex</code> | Hash encoding. |

**Example**  
```js
const {error, value} = issue({salt, secret}, {email: 'foo@bar.com'});
```
<a name="module_passcode..verify"></a>

### passcode~verify(token, security, hash) ⇒ <code>Object</code>
Verifies a signed token with the provided challenge passcode.

**Kind**: inner method of [<code>passcode</code>](#module_passcode)  
**Returns**: <code>Object</code> - `{error, value: {iat, jti, exp, ...TOKEN_PAYLOAD}}`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| token | <code>String</code> |  | The token to be verified |
| security | <code>Object</code> |  |  |
| security.passcode | <code>String</code> |  | The challenge passcode. |
| security.salt | <code>String</code> |  | A string to salt the challenge passcode hash. |
| security.secret | <code>String</code> |  | A string to verify the JWT. |
| [security.iss] | <code>String</code> |  | JWT issuer (used as additional verification). |
| [security.aud] | <code>String</code> |  | JWT audience (used as additional  verification). |
| [security.sub] | <code>String</code> |  | JWT subject (used as additional  verification). |
| hash | <code>Object</code> |  | Essentially a passthrough for [`pbkdf2`](https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest)  hashing options. |
| [hash.iterations] | <code>Number</code> | <code>1000</code> | Hash iterations. |
| [hash.keyLength] | <code>Number</code> | <code>64</code> | Hash length. |
| [hash.digest] | <code>String</code> | <code>sha512</code> | Hashing algorithm. |
| [hash.encoding] | <code>String</code> | <code>hex</code> | Hash encoding. |

**Example**  
```js
const {error, value} = verify(token, {passcode, salt, secret});
```

## Examples

### For Simple Verification

```js
const {issue, verify} = require('passcode');

// Generate a signed token with hashed random passcode
const {error, value: {id, expires, passcode, token}} = issue({
  salt: YOUR_SALT,
  secret: YOUR_SECRET
});
/**
 * Do something with the token
 */
// Verify token with code
const {error, value} = verify(token, {
  passcode: ENTERED_PASSCODE,
  salt: YOUR_SALT,
  secret: YOUR_SECRET
});
```

### For Including Payload Data

```js
const {issue, verify} = require('passcode');

// Generate a signed token with custom payload
const {error, value: {id, expires, passcode, token}} = issue({
  salt: YOUR_SALT,
  secret: YOUR_SECRET
}, {
  email: 'foo@bar.com'
});
/**
 * Do something with the token
 */
// Verify token with code
const {error, value: {email}} = verify(token, {
  passcode: ENTERED_PASSCODE,
  salt: YOUR_SALT,
  secret: YOUR_SECRET
});
```

## License

MIT
