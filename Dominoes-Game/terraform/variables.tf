variable "bucket_name" {
  description = "Name of the S3 bucket for hosting the Dominoes game"
  type        = string
  default     = "dominoes-game-static-website"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}
