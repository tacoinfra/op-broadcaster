import Utils from "../lib/utils";

test("utils - mergeBytes", () => {
    // GIVEN two byte arrays.
    const b1 = new Uint8Array([1, 2]);
    const b2 = new Uint8Array([3, 4]);

    // WHEN the arrays are merged.
    const merged = Utils.mergeBytes(b1, b2);

    // THEN the result is the concatenation of the two buffers.
    expect(merged).toStrictEqual(new Uint8Array([1, 2, 3, 4]));
});

test("utils - bytesToHex", () => {
    // GIVEN some binary.
    const expectedHex = "1234";
    const bytes = new Buffer(expectedHex, "hex");

    // WHEN they bytes are converted to hex THEN they serialize correctly.
    expect(Utils.bytesToHex(bytes)).toStrictEqual(expectedHex);
});

test("utils - hexToBytes", () => {
    // GIVEN some hex.
    const expectedBytes = new Uint8Array([1, 2, 3]);
    const hex = new Buffer(expectedBytes).toString("hex");

    // WHEN the hex is converted to bytes THEN it serializes correctly.
    expect(Utils.hexToBytes(hex)).toStrictEqual(expectedBytes);
});

test("utils - hexToBytes - invalid hex", () => {
    // GIVEN some invalid hex.
    const invalid = "blockscale";

    // WHEN the hex is converted to bytes THEN an exception is thrown.
    expect(() => {  Utils.hexToBytes(invalid); }).toThrow();
});