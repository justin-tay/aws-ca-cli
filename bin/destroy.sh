aws secretsmanager delete-secret --secret-id "prod/aws-ca/root-ca/key" --force-delete-without-recovery
aws secretsmanager delete-secret --secret-id "prod/aws-ca/sub-ca/key" --force-delete-without-recovery
aws dynamodb delete-table --table-name "CertificateAuthority"
aws dynamodb delete-table --table-name "CertificateAuthorityIndex"
aws ssm delete-parameter --name "/prod/aws-ca/root-ca/key"
aws ssm delete-parameter --name "/prod/aws-ca/sub-ca/key"