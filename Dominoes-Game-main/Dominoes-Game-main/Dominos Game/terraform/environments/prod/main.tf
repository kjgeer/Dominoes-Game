terraform {
  required_version = ">= 1.0"
}

module "infrastructure" {
  source = "../../"

  # General
  aws_region   = var.aws_region
  environment  = "prod"
  project_name = "dominoes-game"

  # VPC
  vpc_cidr           = "10.1.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

  # EKS
  eks_cluster_version     = "1.28"
  eks_node_instance_types = ["t3.large"]
  eks_desired_size        = 3
  eks_min_size           = 2
  eks_max_size           = 6

  # ECR
  ecr_repositories = ["dominoes-game"]

  # ArgoCD
  argocd_enabled = true
  argocd_version = "5.51.0"

  tags = {
    Environment = "prod"
    ManagedBy   = "terraform"
    Project     = "dominoes-game"
    CostCenter  = "engineering"
  }
}

output "vpc_id" {
  value = module.infrastructure.vpc_id
}

output "eks_cluster_name" {
  value = module.infrastructure.eks_cluster_name
}

output "eks_cluster_endpoint" {
  value = module.infrastructure.eks_cluster_endpoint
}

output "ecr_repository_urls" {
  value = module.infrastructure.ecr_repository_urls
}

output "configure_kubectl" {
  value = module.infrastructure.configure_kubectl
}

output "argocd_server_url" {
  value = module.infrastructure.argocd_server_url
}

output "argocd_admin_password_command" {
  value = module.infrastructure.argocd_admin_password_command
}