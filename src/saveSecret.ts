import { CreateSecretCommand } from '@aws-sdk/client-secrets-manager';
import { getSecretsManagerClient } from './getSecretsManagerClient';

export async function saveSecret(secretId: string, secretString: string) {
  const client = getSecretsManagerClient();

  const createSecretCommand = new CreateSecretCommand({
    Name: secretId,
    SecretString: secretString,
  });
  return await client.send(createSecretCommand);
}
