import * as WebRequest from 'web-request';
import { httpOK } from './http-request-codes';

/** Headers for requests to the node. */
const requestHeaders = {"headers": {"Content-Type": "application/json"}};

/** Node endpoints */
const injectionEndpoint = "injection/operation";

/** 
 * A network client that can make requests and returns responses. 
 * 
 * These interfaces are provided as a facade to WebRequest so that networking can be faked in tests.
 */
interface NetworkClientResponse {
  statusCode: number;
  content: string;
}
interface NetworkClient {
  post(uri: string, options?: WebRequest.RequestOptions, content?: any): Promise<NetworkClientResponse>;
}

/** Client class for a Tezos Node. */
class NodeClient {
  /**
   * @param nodeURL The URL of the remote node.
   * @param networkClient A class which manages network requests. Exposed for testing.
   */
  public constructor(private nodeURL: string, private networkClient: NetworkClient = WebRequest) {};
 
  /**
   * Inject the given operation into the node and retrieve an operation hash.
   * 
   * @param hex A hexadecimal string which represents the signed operation.
   */ 
  async inject(hex: string): Promise<string> {
    const targetURL = this.nodeURL + "/" + injectionEndpoint;
    const payload = "\"" + hex + "\"";
    
    const response = await this.networkClient.post(targetURL, requestHeaders, payload);
    if (response.statusCode !== httpOK) {
      throw new Error(response.content);
    }
    return JSON.parse(response.content);
  }
  
}

export default NodeClient;