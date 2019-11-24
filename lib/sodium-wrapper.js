const _sodium = require('libsodium-wrappers');

// Wrap up Sodium usage in a pure-JS file to work around an apparent bug in the TypeScript transpiler.
// See: https://github.com/jedisct1/libsodium.js/issues/189.
const sign = async (message, privateKey) => {
  await _sodium.ready;
  const sodium = _sodium;
  console.log(privateKey);
  return sodium.crypto_sign_detached(message, privateKey);
}

module.exports = sign;