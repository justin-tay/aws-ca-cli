import KeyStore from './KeyStore';
import { configuration } from './config';
import { createCaHierarchy } from './createCaHierarchy';
import { saveCa } from './saveCa';
import { saveCaIndex } from './saveCaIndex';

export async function initializeCertificateAuthority() {
  console.info('Initializing certificate authority');
  const rootCaName = configuration.rootCaName;
  const subCaName = configuration.subCaName;

  const caHierarchy = await createCaHierarchy({
    rootCa: { name: rootCaName, validity: 20 },
    subCa: {
      name: subCaName,
      validity: 15,
    },
  });
  try {
    if (configuration.keyStore === KeyStore.SecretsManager) {
      await saveCa({
        certificate: caHierarchy.rootCa.certificate,
        keySecretId: configuration.rootCaKeySecretId,
      });
    } else {
      await saveCa({
        certificate: caHierarchy.rootCa.certificate,
        keyParameterName: configuration.rootCaKeyParameterName,
      });
    }
    await saveCaIndex({
      ca: { certificate: caHierarchy.rootCa.certificate },
      issued: { certificate: caHierarchy.rootCa.certificate },
    });
    console.info(`Created Root CA ${rootCaName}`);
  } catch (err) {
    console.error(`Failed to create Root CA ${rootCaName}`);
    throw err;
  }
  try {
    if (configuration.keyStore === KeyStore.SecretsManager) {
      await saveCa({
        certificate: caHierarchy.subCa.certificate,
        keySecretId: configuration.subCaKeySecretId,
        crlBucketName: configuration.subCaCrlBucketName,
        crlKey: configuration.subCaCrlKey,
      });
    } else {
      await saveCa({
        certificate: caHierarchy.subCa.certificate,
        keyParameterName: configuration.subCaKeyParameterName,
        crlBucketName: configuration.subCaCrlBucketName,
        crlKey: configuration.subCaCrlKey,
      });
    }
    await saveCaIndex({
      ca: { certificate: caHierarchy.rootCa.certificate },
      issued: { certificate: caHierarchy.subCa.certificate },
    });
    console.info(`Created Sub CA ${subCaName}`);
  } catch (err) {
    console.error(`Failed to create Sub CA ${subCaName}`);
    throw err;
  }
}
