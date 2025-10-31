output "website_endpoint" {
  description = "Website endpoint URL"
  value       = "http://${aws_s3_bucket_website_configuration.dominoes_game.website_endpoint}"
}

output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.dominoes_game.id
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.dominoes_game.arn
}

output "website_domain" {
  description = "Domain name of the website endpoint"
  value       = aws_s3_bucket_website_configuration.dominoes_game.website_endpoint
}
