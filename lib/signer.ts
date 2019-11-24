import Utils from './utils';
import * as blakejs from 'blakejs';
const base58Check = require('bs58check');
const sodium = require('libsodium-wrappers');

// Watermark for operations.
const operationWatermarkBytes: Uint8Array =  new Uint8Array([3]);

// Length of hash for signing.
const signingHashLength = 32;

/** Abstracts signing functionality. */
class Signer {
  /**
   * Sign the given operation with the given secret key.
   * 
   * @param operationHex The operation to sign.
   * @param secretKeyBase58 A base58check representation of the secret key, prefixed with 'edsk'
   */
  static async signOperation(operationHex: string, secretKeyBase58: string): Promise<string> {
    // Convert operation to binary, apply watermark, and hash.
    const operationBytes = Utils.hexToBytes(operationHex);
    const watermarkedBytes = Utils.mergeBytes(operationWatermarkBytes, operationBytes);
    const hashedBytes = blakejs.blake2b(watermarkedBytes, null, signingHashLength);     

    // Decode raw bytes of the secret key
    const decodedKeyHex = base58Check.decode(secretKeyBase58).slice(4).toString('hex');
    const decodedKeyBytes = Utils.hexToBytes(decodedKeyHex);

    // Sign bytes with key.
    await sodium.ready;
    const signatureBytes = sodium.crypto_sign_detached(hashedBytes, decodedKeyBytes);
  
    // Create signed operation by concatenating operation bytes and signature.
    return operationHex + Utils.bytesToHex(signatureBytes);
  }
}

export default Signer;