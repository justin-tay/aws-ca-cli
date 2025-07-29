import { CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { waitForTableActive } from './waitForTableActive';
import { getDynamoDBClient } from './getDynamoDBClient';
import { configuration } from './config';

export async function createCaIndexTable() {
  const client = getDynamoDBClient();
  const tableName = configuration.caIndexTableName;
  const command = new CreateTableCommand({
    TableName: tableName,
    AttributeDefinitions: [
      {
        AttributeName: 'IssuerName',
        AttributeType: 'S',
      },
      {
        AttributeName: 'SerialNumber',
        AttributeType: 'S',
      },
      /*
      {
        AttributeName: "Status",
        AttributeType: "S",
      },
      {
        AttributeName: "SubjectName",
        AttributeType: "S",
      },
      {
        AttributeName: "Certificate",
        AttributeType: "S",
      },
      {
        AttributeName: "ExpirationDate",
        AttributeType: "S",
      },
      {
        AttributeName: "RevocationDate",
        AttributeType: "S",
      },
      {
        AttributeName: "RevocationReason",
        AttributeType: "S",
      },
*/
    ],
    KeySchema: [
      {
        AttributeName: 'IssuerName',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'SerialNumber',
        KeyType: 'RANGE',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  });

  const response = await client.send(command);
  await waitForTableActive(tableName);
  return response;
}
