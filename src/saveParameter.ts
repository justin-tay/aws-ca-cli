import { PutParameterCommand } from '@aws-sdk/client-ssm';
import { getSSMClient } from './getSSMClient';

export async function saveParameter(
  parameterName: string,
  parameterValue: string,
) {
  const client = getSSMClient();

  const putParameterCommand = new PutParameterCommand({
    Name: parameterName,
    Value: parameterValue,
    Type: 'SecureString',
    Overwrite: true,
  });
  return await client.send(putParameterCommand);
}
