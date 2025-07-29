import KeyStore from './KeyStore';

function getRootCaName(name: string) {
  return `CN=${name} Root CA`;
}

function getSubCaName(name: string) {
  return `CN=${name} Sub CA 1`;
}

interface Config {
  caTableName: string;
  caIndexTableName: string;
  rootCaName: string;
  rootCaKeySecretId: string;
  rootCaKeyParameterName: string;
  rootCaCrlBucketName: string | null;
  rootCaCrlKey: string;
  subCaName: string;
  subCaKeySecretId: string;
  subCaKeyParameterName: string;
  subCaCrlBucketName: string | null;
  subCaCrlKey: string;
  keyStore: KeyStore;
  keyAlgorithm: KeyAlgorithm;
  region: string;
  pepper: string;
}

function nonEmpty(value: string | undefined) {
  if (!value || value === '') {
    return null;
  }
  return value;
}

let config: Config;

export function getConfig() {
  if (!config) {
    const name = 'Demo';

    const pepper =
      nonEmpty(process.env.PEPPER) ?? '015c7bd5-46ac-485e-88ef-0355c80337de';

    const keyAlgorithm = {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
    };
    config = {
      caTableName:
        nonEmpty(process.env.CA_TABLE_NAME) ?? 'CertificateAuthority',
      caIndexTableName:
        nonEmpty(process.env.CA_INDEX_TABLE_NAME) ??
        'CertificateAuthortityIndex',
      rootCaName: nonEmpty(process.env.ROOT_CA_NAME) ?? getRootCaName(name),
      rootCaKeySecretId:
        nonEmpty(process.env.ROOT_CA_KEY_SECRET_ID) ??
        'prod/aws-ca/root-ca/key',
      rootCaKeyParameterName:
        nonEmpty(process.env.ROOT_CA_KEY_PARAMETER_NAME) ??
        '/prod/aws-ca/root-ca/key',
      rootCaCrlBucketName:
        nonEmpty(process.env.ROOT_CA_CRL_BUCKET_NAME) ??
        nonEmpty(process.env.CA_CRL_BUCKET_NAME),
      rootCaCrlKey: nonEmpty(process.env.ROOT_CA_CRL_KEY) ?? 'root-ca.crl',
      subCaName: nonEmpty(process.env.SUB_CA_NAME) ?? getSubCaName(name),
      subCaKeySecretId:
        nonEmpty(process.env.SUB_CA_KEY_SECRET_ID) ?? 'prod/aws-ca/sub-ca/key',
      subCaKeyParameterName:
        nonEmpty(process.env.SUB_CA_KEY_PARAMETER_NAME) ??
        '/prod/aws-ca/sub-ca/key',
      subCaCrlBucketName:
        nonEmpty(process.env.SUB_CA_CRL_BUCKET_NAME) ??
        nonEmpty(process.env.CA_CRL_BUCKET_NAME),
      subCaCrlKey: nonEmpty(process.env.SUB_CA_CRL_KEY) ?? 'sub-ca.crl',
      keyStore:
        (nonEmpty(process.env.KEYSTORE) as KeyStore) ?? KeyStore.ParameterStore,
      //keyStore: KeyStore.SecretsMamager
      keyAlgorithm,
      region: nonEmpty(process.env.AWS_REGION) ?? 'ap-southeast-1',
      pepper,
    };
  }
  return config;
}
