import { CreateSecretCommand } from '@aws-sdk/client-secrets-manager';
import { getSecretsManagerClient } from './getSecretsManagerClient';
import { getConfig } from './getConfig';

export async function saveSecret(secretId: string, secretString: string) {
  const client = getSecretsManagerClient();

  const { secretsManagerKmsKeyId: kmsKeyId } = getConfig();

  const createSecretCommand = new CreateSecretCommand({
    Name: secretId,
    SecretString: secretString,
    KmsKeyId: kmsKeyId,
  });
  return await client.send(createSecretCommand);
}
