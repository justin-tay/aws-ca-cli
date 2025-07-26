import { configuration } from './config';

export function getObjectUrl(params: {
  bucketName: string;
  key: string;
  region?: string;
}) {
  const { bucketName, key } = params;
  const region = params.region ?? configuration.region;
  return `http://${bucketName}.s3.${region}.com/${key}`;
}
