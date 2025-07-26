import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { configuration } from './config';

let client: SecretsManagerClient | undefined = undefined;

export function getSecretsManagerClient() {
  client ??= new SecretsManagerClient({ region: configuration.region });
  return client;
}
