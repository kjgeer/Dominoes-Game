# S3 backend for storing Terraform state
# Uncomment and configure after creating S3 bucket and DynamoDB table

# terraform {
#   backend "s3" {
#     bucket         = "dominoes-game-terraform-state"
#     key            = "terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }

# Instructions to create backend:
# 
# 1. Create S3 bucket:
#    aws s3 mb s3://dominoes-game-terraform-state --region us-east-1
#    aws s3api put-bucket-versioning --bucket dominoes-game-terraform-state --versioning-configuration Status=Enabled
#    aws s3api put-bucket-encryption --bucket dominoes-game-terraform-state --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
#
# 2. Create DynamoDB table for state locking:
#    aws dynamodb create-table \
#      --table-name terraform-state-lock \
#      --attribute-definitions AttributeName=LockID,AttributeType=S \
#      --key-schema AttributeName=LockID,KeyType=HASH \
#      --billing-mode PAY_PER_REQUEST \
#      --region us-east-1
#
# 3. Uncomment the backend configuration above and run:
#    terraform init -reconfigure