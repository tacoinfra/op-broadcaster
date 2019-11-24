const isHex = require('is-hex');

class Utils {
  /** Please do not construct this static utility class. */
  private constructor() {}

  /**
   * Merge the given bytes.
   */
  static mergeBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
    const merged = new Uint8Array(a.length + b.length)
    merged.set(a)
    merged.set(b, a.length);
  
    return merged;
  }
  
  /**
   * Convert the given hex string to bytes.
   */
  static hexToBytes(hex: string): Uint8Array {
    if (!isHex(hex)) {
        throw new Error("Invalid hex" + hex);
    }

    return Uint8Array.from(Buffer.from(hex, 'hex'));
  }
  
  /**
   * Convert the given bytes to hex.
   */
  static bytesToHex(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString('hex');
  }
}

export default Utils;
