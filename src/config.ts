import KeyStore from './KeyStore';

function getRootCaName(name: string) {
  return `CN=${name} Root CA`;
}

function getSubCaName(name: string) {
  return `CN=${name} Sub CA 1`;
}

const name = 'Demo';

const pepper = process.env.PEPPER ?? '015c7bd5-46ac-485e-88ef-0355c80337de';

const keyAlgorithm = {
  name: 'RSASSA-PKCS1-v1_5',
  hash: 'SHA-256',
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
};

export const configuration = {
  rootCaName: process.env.ROOT_CA_NAME ?? getRootCaName(name),
  rootCaKeySecretId:
    process.env.ROOT_CA_KEY_SECRET_ID ?? 'prod/aws-ca/root-ca/key',
  rootCaKeyParameterName:
    process.env.ROOT_CA_KEY_PARAMETER_NAME ?? '/prod/aws-ca/root-ca/key',
  rootCaCrlBucketName: process.env.ROOT_CA_CRL_BUCKET_NAME ?? 'aws-ca-crls',
  rootCaCrlKey: process.env.ROOT_CA_CRL_KEY ?? 'ca.crl',
  subCaName: process.env.SUB_CA_NAME ?? getSubCaName(name),
  subCaKeySecretId:
    process.env.SUB_CA_KEY_SECRET_ID ?? 'prod/aws-ca/sub-ca/key',
  subCaKeyParameterName:
    process.env.SUB_CA_KEY_PARAMETER_NAME ?? '/prod/aws-ca/sub-ca/key',
  subCaCrlBucketName: process.env.SUB_CA_CRL_BUCKET_NAME ?? 'aws-ca-crls',
  subCaCrlKey: process.env.SUB_CA_CRL_KEY ?? 'subca.crl',
  keyStore: process.env.KEYSTORE ?? KeyStore.ParameterStore,
  //keyStore: KeyStore.SecretsMamager
  keyAlgorithm,
  region: process.env.AWS_REGION ?? 'ap-southeast-1',
  pepper,
};
