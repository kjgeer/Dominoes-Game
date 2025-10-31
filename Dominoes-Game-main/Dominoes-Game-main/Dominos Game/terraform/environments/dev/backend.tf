# Backend configuration for dev environment
# Uncomment after creating S3 bucket

# terraform {
#   backend "s3" {
#     bucket         = "dominoes-game-terraform-state"
#     key            = "dev/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }