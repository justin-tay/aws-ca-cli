import { PemConverter } from '@peculiar/x509';
import { fromBER } from 'asn1js';
import { PKCS8ShroudedKeyBag } from 'pkijs';
import { stringToArrayBuffer } from 'pvutils';

export async function importPkcs8PemPrivateKey(
  pem: string,
  password: string,
  algorithm:
    | AlgorithmIdentifier
    | RsaHashedImportParams
    | EcKeyImportParams
    | HmacImportParams
    | AesKeyAlgorithm,
  extractable: boolean,
  keyUsages: KeyUsage[],
) {
  const ber = PemConverter.decodeFirst(pem);

  const pkcs8dec = new PKCS8ShroudedKeyBag({
    schema: fromBER(ber).result,
  });
  // cast as any as parseInternalValues is not public
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (pkcs8dec as any).parseInternalValues({
    password: stringToArrayBuffer(password),
  });

  if (pkcs8dec.parsedValue) {
    return await crypto.subtle.importKey(
      'pkcs8',
      pkcs8dec.parsedValue.toSchema().toBER(),
      algorithm,
      extractable,
      keyUsages,
    );
  }
  throw new Error('Failed to parse value');
}
