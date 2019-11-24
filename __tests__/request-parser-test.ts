import RequestParser from "../lib/request-parser";

test("RequestParser - parseOperationFromRequest - valid request", () => {
  // GIVEN a valid request.
  const expectedOperation = "blockscale";
  const request = { body: JSON.stringify({op: expectedOperation}) };

  // WHEN an operation is parsed from the request.
  const operation = RequestParser.parseOperationFromRequest(request);

  // THEN the operation was parsed correctly.
  expect(operation).toStrictEqual(expectedOperation);
});

test("RequestParser - parseOperationFromRequest - missing op field", () => {
    // GIVE a request missing the op field;
    const request = { body: JSON.stringify({block: "scale"})};

    // WHEN the request is parsed THEN an exception is thrown.
    expect(() => { RequestParser.parseOperationFromRequest(request) }).toThrow();
});

test("RequestParser - parseOperationFromRequest - invalid JSON", () => {
    // GIVE a request missing the op field;
    const request = { body: "blockscale" };

    // WHEN the request is parsed THEN an exception is thrown.
    expect(() => { RequestParser.parseOperationFromRequest(request) }).toThrow();
});