# @CentralPing/passcode

[![Build Status](https://travis-ci.org/CentralPing/passcode.svg?branch=master)](https://travis-ci.org/CentralPing/passcode)
[![Coverage Status](https://coveralls.io/repos/github/CentralPing/passcode/badge.svg)](https://coveralls.io/github/CentralPing/passcode)
[![Dependency Status](https://david-dm.org/CentralPing/passcode.svg)](https://david-dm.org/CentralPing/passcode)
[![Greenkeeper Status](https://badges.greenkeeper.io/CentralPing/passcode.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/centralping/passcode/badge.svg)](https://snyk.io/test/github/centralping/passcode)

A slightly opinionated stateless passcode manager.

As with all JWTs, extreme care should be employed if including any sensitive information in the payload.

## Installation

`npm i --save https://github.com/CentralPing/passcode`

## API Reference

<a name="module_passcode..issue"></a>

### passcode~issue([payload], claims, hash) ⇒ <code>Object</code>
Issues a token, token ID, expiration and the stringified challenge code.

**Kind**: inner method of [<code>passcode</code>](#module_passcode)  
**Returns**: <code>Object</code> - `{error, value: {id, expires, code, token}}`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [payload] | <code>Object</code> |  |  |
| [payload.iat] | <code>Date</code> | <code>Date.now</code> | JWT issue timestamp. |
| [payload.jti] | <code>Date</code> | <code>uuid</code> | JWT ID (should be unique). |
| claims | <code>Object</code> |  |  |
| claims.secret | <code>String</code> |  | A string to sign the JWT. |
| [claims.code] | <code>String</code> | <code>??????</code> | The challenge code (defaults to  random 6 digit string). |
| [claims.issuer] | <code>String</code> |  | JWT issuer (used as additional verification). |
| [claims.subject] | <code>String</code> |  | JWT subject (used as additional  verification). |
| [claims.audience] | <code>String</code> |  | JWT audience (used as additional  verification). |
| [claims.expiresIn] | <code>Number</code> \| <code>String</code> | <code>5m</code> | JWT expiration time span.  In seconds or a parsable string for [zeit/ms](https://github.com/zeit/ms) |
| hash | <code>Object</code> |  |  |
| [hash.salt] | <code>String</code> |  | A string to salt the challenge code  hash. If undefined then the code will not be hashed. |
| [hash.iterations] | <code>Number</code> | <code>1000</code> | Iterations for hash. |
| [hash.keyLength] | <code>Number</code> | <code>64</code> | Length of hash. |
| [hash.digest] | <code>String</code> | <code>sha512</code> | Hashing algorithm. |
| [hash.encoding] | <code>String</code> | <code>hex</code> | Hash encoding. |

**Example**  
```js
const {value: {id, expires, code, token}} = issue(
  {email: 'foo@bar.com'},
  {secret},
  {salt}
);
```
<a name="module_passcode..verify"></a>

### passcode~verify(token, claims, hash) ⇒ <code>Object</code>
Verifies an issued token with the provided challenge code

**Kind**: inner method of [<code>passcode</code>](#module_passcode)  
**Returns**: <code>Object</code> - `{error, value: {iat, jti, exp, ...TOKEN_INFO}}`  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| token | <code>String</code> |  | The token to be verified |
| claims | <code>Object</code> |  |  |
| [claims.code] | <code>String</code> | <code>&#x27;&#x27;</code> | The challenge code. |
| claims.secret | <code>String</code> |  | A string to sign the JWT. |
| [claims.issuer] | <code>String</code> |  | JWT issuer (used as additional verification). |
| [claims.subject] | <code>String</code> |  | JWT subject (used as additional  verification). |
| [claims.audience] | <code>String</code> |  | JWT audience (used as additional |
| hash | <code>Object</code> |  |  |
| [hash.salt] | <code>String</code> |  | A string to salt the challenge code  hash. If undefined then the code will not be hashed. |
| [hash.iterations] | <code>Number</code> | <code>1000</code> | Iterations for hash. |
| [hash.keyLength] | <code>Number</code> | <code>64</code> | Length of hash. |
| [hash.digest] | <code>String</code> | <code>sha512</code> | Hashing algorithm. |
| [hash.encoding] | <code>String</code> | <code>hex</code> | Hash encoding. |

**Example**  
```js
const tokenInfo = verify(token, challengeCode);
```

## Examples

### For Simple Verification

```js
const {issue, verify} = require('passcode');
const {v4} = require('uuid');

const secret = v4();

// Generate a token with random passcode
const {error, value: {id, expires, code, token}} = issue({}, {secret});
/**
 * Do something with the token
 */
// Verify token with code
const {error, value} = verify(token, {secret, code});
```

### For Verification With Meta Information

```js
const {issue, verify} = require('passcode');
const {v4} = require('uuid');

const salt = v4();
const secret = v4();

// Generate a token with custom payload
const {error, value: {id, expires, code, token}} = issue(
  {email: 'foo@bar.com'},
  {secret}
);
/**
 * Do something with the token
 */
// Verify token with code
const {error, {email}} = verify(token, {secret, code});
```

### For Hashing Challenge Code
By default challenge codes are stored as a string in the payload of the JWT. Providing a salt (as well as other hashing options) can provide a bit more security.

```js
const {issue, verify} = require('passcode');
const {v4} = require('uuid');

const secret = v4();
const salt = v4();

// Generate a token with random passcode
const {error, value: {id, expires, code, token}} = issue({}, {secret}, {salt});
/**
 * Do something with the token
 */
// Verify token with code
const {error, value} = verify(token, {secret, code}, {salt});
```

## License

MIT
