import Signer from "../lib/signer";

/** Valid secret key in base58 format. */
const secretKeyBase58 = "edskRt2V2VNrPyhoJJjEt8w3MD9sgHhPFFKkf6JmVU9ivFAt2Rj1p6jTFTohJEMnpCR8iCN8HgnNNfHHR1NvveZwY9Mhfd1mEV"
/** Valid operation in hex. */
const operationHex = "43ac92cd81468ec2b89cf28e40111150504264ab01375735e412445820f41c3608000081faa75f741ef614b0e35fcc8c90dfa3b0b95721fe0ad5f401bc5081020100026fde46af0356a0476dae4e4600172dc9309b3aa400"

test('Signer - signOperation - valid inputs', async () => {
  // GIVEN precomputed outputs for signing valid inputs.
  const precomputedSignatureHex = "53d1ba0db72821abe193dad8488ee787b488d7dfde7e987502ee490941da46f0cec86bb2dcf146846ec88d2b8794823913987d114ccfd1e0055cdbf04aa20800"
  const precomputedSignedTransactionHex = operationHex + precomputedSignatureHex

  // WHEN the transaction is signed.
  const signedTransactionHex = await Signer.signOperation(operationHex, secretKeyBase58);

  // THEN the signed transaction matches the precomputed result.
  expect(signedTransactionHex).toStrictEqual(precomputedSignedTransactionHex);
});

test('Signer - signOperation - invalid operation', async () => {
  // GIVEN an operation in an invalid format.
  const invalidOperation = "blockscale"; // not hex

  // WHEN the operation is signed THEN an error is thrown.
  // Note: Awkward syntax used because Jest does not support expecting throws from async functions, see: 
  //    https://github.com/facebook/jest/issues/1700
  const signFunction = async () => {
    return await Signer.signOperation(invalidOperation, secretKeyBase58);
  }
  expect(signFunction()).rejects.toThrow();
});

test('Signer - signOperation - invalid secret key', async () => {
  // GIVEN an secret key in an invalid format
  const invalidSecretKey = "blockscale"; // not base58check
  
  // WHEN the key signs an operation THEN an error is thrown.
  // Note: Awkward syntax used because Jest does not support expecting throws from async functions, see: 
  //    https://github.com/facebook/jest/issues/1700
  const signFunction = async () => {
    return await Signer.signOperation(operationHex, invalidSecretKey);
  }
  expect(signFunction()).rejects.toThrow();
});