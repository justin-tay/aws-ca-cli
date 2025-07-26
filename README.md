# aws-ca-cli

## Background

Command line tool to manage a certificate authority (CA) like [OpenSSL CA](https://openssl-ca.readthedocs.io/en/latest/) but with the database stored on Amazon Web Services resources. This is intended to be a more cost efficient alternative to using [AWS Private Certificate Authority](https://docs.aws.amazon.com/privateca/).

## Usage

```
Usage: aws-ca [options] [command]

CLI to manage Certificate Authority

Options:
  -V, --version                                    output the version number
  -h, --help                                       display help for command

Commands:
  get-certificate-authority-certificate [options]  gets the certificate chain
  issue-certificate [options]                      issue a certificate for a certificate sign request
  request-certificate [options]                    request a certificate and key in a p12 keystore
  revoke-certificate [options]                     revokes a certificate
  help [command]                                   display help for command
```

## Resources

| Logical ID                    | Type                             | Description
| ----------------------------- | -------------------------------- | -----------
| `CertificateAuthority`        | `AWS::DynamoDB::Table`           | Stores the certificate authorities
| `CertificateAuthorityIndex`   | `AWS::DynamoDB::Table`           | Stores the certificates issued
|                               | `AWS::S3::Bucket`                | Stores the certificate revocation list


The following resources are used if `KEYSTORE` is `ParameterStore`.

| Logical ID                    | Type                             | Description
| ----------------------------- | -------------------------------- | -----------
| `/prod/aws-ca/root-ca/key`    | `AWS::SSM::Parameter`            | Stores the encrypted private key for the Root CA as a `SecureString`
| `/prod/aws-ca/sub-ca/key`     | `AWS::SSM::Parameter`            | Stores the encrypted private key for the Sub CA as a `SecureString`

The following resources are used if `KEYSTORE` is `SecretsManager`.

| Logical ID                    | Type                             | Description
| ----------------------------- | -------------------------------- | -----------
| `prod/aws-ca/root-ca/key`     | `AWS::SecretsManager::Secret`    | Stores the encrypted private key for the Root CA
| `prod/aws-ca/sub-ca/key`      | `AWS::SecretsManager::Secret`    | Stores the encrypted private key for the Sub CA

### Destroy Resources

The following script will destroy the resources created otherwise costs will be incurred.

```shell
./bin/destroy.sh
```
## Certificate Signing Request

### Windows

When using Windows the [`certreq`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/certreq_1) application can be used to generate the CSR using an `inf` configuration file. 

The private key will stored in the Windows certificate store in the `Certificate Enrollment Requests` folder in either the `Current User` or `Local Computer` certificate store if `MachineKeySet` is `TRUE`.

The `certlm.msc` command can be used to open the `Local Computer` certificate store in Windows.

The `certmgr.msc` command can be used to open the `Current User` certificate store in Windows.

The following command can be used to generate a new request from an `inf` configuration file.

```shell
certreq -new config.inf client.csr
```

```ini
[Version]
Signature= "$Windows NT$" 
 
[NewRequest]
Subject = "CN=DeviceUid"
KeySpec = AT_KEYEXCHANGE
KeyLength = 2048
Exportable = false
MachineKeySet = true
SMIME = false
PrivateKeyArchive = false
UserProtected = false
UseExistingKeySet = false
ProviderName = "Microsoft RSA SChannel Cryptographic Provider"
ProviderType = 12
RequestType = PKCS10
KeyUsage = 0xa0
 
[EnhancedKeyUsageExtension]
OID=1.3.6.1.5.5.7.3.2

[Extensions]
2.5.29.17 = "{text}"
_continue_ = "dns=UDID=DeviceUid&"
```

The following command is used to link the previously generated private key with the issued certificate and removes the pending certificate request from the system.

This requires administrative privileges if `MachineKeySet` is `TRUE`.

```shell
certreq -accept certificates.crt
```

Note that the certificate chain needs to already be installed in the certificate store in Windows otherwise the following error will be displayed.

```
A certificate issued by the certification authority cannot be installed. Contact your administrator.
A certificate chain could not be built to a trusted root authority. 0x800b010a (-2146762486 CERT_E_CHAINING)
```