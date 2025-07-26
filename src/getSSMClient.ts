import { SSMClient } from '@aws-sdk/client-ssm';
import { configuration } from './config';

let client: SSMClient | undefined = undefined;

export function getSSMClient() {
  client ??= new SSMClient({ region: configuration.region });
  return client;
}
