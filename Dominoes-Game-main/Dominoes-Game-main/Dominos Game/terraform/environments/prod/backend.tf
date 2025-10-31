# Backend configuration for prod environment
# Uncomment after creating S3 bucket

# terraform {
#   backend "s3" {
#     bucket         = "dominoes-game-terraform-state"
#     key            = "prod/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }