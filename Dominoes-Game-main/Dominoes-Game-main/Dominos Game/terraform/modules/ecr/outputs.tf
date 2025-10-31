output "repository_urls" {
  description = "Map of repository names to URLs"
  value = {
    for k, v in aws_ecr_repository.main : k => v.repository_url
  }
}

output "repository_arns" {
  description = "Map of repository names to ARNs"
  value = {
    for k, v in aws_ecr_repository.main : k => v.arn
  }
}

output "repository_ids" {
  description = "Map of repository names to IDs"
  value = {
    for k, v in aws_ecr_repository.main : k => v.registry_id
  }
}