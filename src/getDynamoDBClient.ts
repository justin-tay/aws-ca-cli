import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { configuration } from './config';

let client: DynamoDBClient | undefined = undefined;

export function getDynamoDBClient() {
  client ??= new DynamoDBClient({ region: configuration.region });
  return client;
}
