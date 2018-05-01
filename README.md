# @centralping/passcode

[![Build Status](https://travis-ci.org/CentralPing/passcode.svg?branch=master)](https://travis-ci.org/CentralPing/passcode)
[![Coverage Status](https://coveralls.io/repos/github/CentralPing/passcode/badge.svg)](https://coveralls.io/github/CentralPing/passcode)
[![Dependency Status](https://david-dm.org/CentralPing/passcode.svg)](https://david-dm.org/CentralPing/passcode)
[![Greenkeeper Status](https://badges.greenkeeper.io/CentralPing/passcode.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/centralping/passcode/badge.svg)](https://snyk.io/test/github/centralping/passcode)

A slightly opinionated stateless passcode manager.

*The exposed configuration object will act as a global for all imports of this module.*

## Installation

`npm i --save https://github.com/CentralPing/passcode`

## API Reference

<a name="module_passcode..issue"></a>

### passcode~issue(payload, claims) ⇒ <code>Object</code>
Issues an object containing the stringified challenge code, token ID,
 and token

**Kind**: inner method of [<code>passcode</code>](#module_passcode)  
**Returns**: <code>Object</code> - Contains the stringified challenge code, token ID, and token  

| Param | Type |
| --- | --- |
| payload | <code>Object</code> | 
| claims | <code>Object</code> | 

**Example**  
```js
const challengeTokenInfo = issue({email: 'foo@bar.com'});
```
<a name="module_passcode..verify"></a>

### passcode~verify(token, verifications) ⇒ <code>Object</code>
Verifies an issued token with the provided challenge code

**Kind**: inner method of [<code>passcode</code>](#module_passcode)  
**Returns**: <code>Object</code> - The decoded token  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | The token to be verified |
| verifications | <code>Object</code> | The challenge code to verify the token |

**Example**  
```js
const tokenInfo = verify(token, challengeCode);
```

## Examples

### For Simple Verification

```js
const { issue, verify } = require('passcode');

// Generate a token with random passcode
const tokenInfo = issue(); // {id, expires, code, token}
/**
 * Do something with the token
 */
// Verify token with code
const decodedToken = verify(token, {code: '012345'});
```

### For Verification With Meta Information

```js
const { issue, verify } = require('passcode');

// Generate a token with random passcode
const tokenInfo = issue({email: 'foo@bar.com'}); // {id, expires, code, token}
/**
 * Do something with the token
 */
// Verify token with code
const decodedToken = verify(token, {code: '012345'});
```

## License

MIT
