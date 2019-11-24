import { APIGatewayProxyHandler } from 'aws-lambda';
import Logger from './lib/logger';
import RequestParser from './lib/request-parser';
import NodeClient from './lib/node-client';
import { httpOK, httpServerError } from './lib/http-request-codes';
import Signer from './lib/signer';

// URL of Tezos Node.
const tezosNodeURL = process.env.NODE_ADDR;

export const sign: APIGatewayProxyHandler = async (event, _context) => {
  const logger = new Logger();
  logger.log("Handling a new request.");

  const nodeClient = new NodeClient(tezosNodeURL);

  try {
    // Load secret key from environment variables.
    const secretKeyBase58 = process.env.SECRET_KEY_BASE_58;
    if (secretKeyBase58 == undefined) {
      throw new Error("Could not instantiate secret key");
    }

    const operationHex = RequestParser.parseOperationFromRequest(event);
    logger.log("Parsed operation as: " + operationHex);

    const signedTransaction = await Signer.signOperation(operationHex, secretKeyBase58);
    const hash = await nodeClient.inject(signedTransaction);
    logger.log("Injected with hash: " + hash);

    return {
      statusCode: httpOK,
      body: hash,
    };
  } catch (exception) {
    const failureMessage = "Failure: " + exception
    logger.log(failureMessage);

    return {
      statusCode: httpServerError,
      body: failureMessage
    }
  }
}
