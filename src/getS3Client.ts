import { S3Client } from '@aws-sdk/client-s3';
import { configuration } from './config';

let client: S3Client | undefined = undefined;

export function getS3Client() {
  client ??= new S3Client({ region: configuration.region });
  return client;
}
