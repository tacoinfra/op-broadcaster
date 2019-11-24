import * as WebRequest from 'web-request';
import { httpOK, httpServerError } from '../lib/http-request-codes';
import NodeClient from '../lib/node-client';

/** Fake network client that can be injected into node client to mock interactions. */
class FakeNetworkClient {
  public constructor(private response: FakeNetworkClientResponse) {};

  post(_uri: string, _options?: WebRequest.RequestOptions, _content?: any): Promise<FakeNetworkClientResponse> {
    return new Promise((resolve, _reject) => { 
      resolve(this.response);
    });
  }
}

/** A fake response from the FakeNetworkClient. */
class FakeNetworkClientResponse {
  public constructor(public statusCode: number, public content: string) {};
}

test("NodeClient - inject - node success", async () => {
  // GIVEN a node client with a network layer faked to always return 200 and a hash.
  // NOTE: The node returns a JSON string value, and we expect to return a unquoted string.
  const expectedHash = "oo123";
  const fakedResponse = "\"" + expectedHash + "\"\n";
  const nodeClient = makeNodeClient(httpOK, fakedResponse);

  // WHEN an operation is injected.
  const hash = await nodeClient.inject("ABC123");

  // THEN the returned hash is correct.
  expect(hash).toStrictEqual(expectedHash);
});

test("NodeClient - inject - node failure", () => {
  // GIVEN a node client with a network layer faked to always return a server error.
  const nodeClient = makeNodeClient(httpServerError, "failure");

  // WHEN an operation is injected THEN an error is thrown.
  // Note: Awkward syntax used because Jest does not support expecting throws from async functions, see: 
  //    https://github.com/facebook/jest/issues/1700
  const injectFunction = async () => {
    return await nodeClient.inject("");
  }
  expect(injectFunction()).rejects.toThrow();
});

/** Make a NodeClient that will always return the given parameters for a rejection request. */
function makeNodeClient(responseCode: number, content: string): NodeClient {
  const fakeResponse = new FakeNetworkClientResponse(responseCode, content);
  const fakeNetworkClient = new FakeNetworkClient(fakeResponse);

  const fakeNodeURL = "http://tezos.node";
  return new NodeClient(fakeNodeURL, fakeNetworkClient);
}