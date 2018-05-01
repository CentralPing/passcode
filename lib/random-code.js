// import { randomBytes } from 'crypto';
const {randomBytes} = require('crypto');

exports.randomCode = randomCode;

/**
 * Generates a stringified numeric code with specified length (default: 6).
 * @private
 * @example
 * const defaultLengthCode = randomCode(); // '012345'
 * const shorterLengthCode = randomCode(3); // '012'
 * @param {Number} [len=6] The length of the random numeric code
 * @return {String} Stringified random numeric code
 */
function randomCode(len = 6) {
  // Generate max buffer (for readUIntLE) of 6 random bytes
  const buf = randomBytes(6);
  // Convert random bytes to stringifed unsigned integer of desired length
  const code = buf.readUIntLE(0, 6).toString().substr(-len);

  // Zero-pad string in case less than required length
  return '0'.repeat(len - code.length) + code;
}
