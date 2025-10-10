# VPC Module
module "vpc" {
  source = "./modules/vpc"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr          = var.vpc_cidr
  availability_zones = var.availability_zones
  tags              = var.tags
}

# ECR Module
module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  environment  = var.environment
  repositories = var.ecr_repositories
  tags         = var.tags
}

# EKS Module
module "eks" {
  source = "./modules/eks"

  project_name       = var.project_name
  environment        = var.environment
  cluster_version    = var.eks_cluster_version
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  
  node_groups = {
    general = {
      instance_types = var.eks_node_instance_types
      desired_size   = var.eks_desired_size
      min_size      = var.eks_min_size
      max_size      = var.eks_max_size
    }
  }
  
  tags = var.tags

  depends_on = [module.vpc]
}
# ArgoCD Module
module "argocd" {
  count  = var.argocd_enabled ? 1 : 0
  source = "./modules/argocd"

  cluster_name     = module.eks.cluster_name
  cluster_endpoint = module.eks.cluster_endpoint
  argocd_version   = var.argocd_version
  argocd_namespace = "argocd"
  tags             = var.tags
  
  depends_on = [module.eks]
}

# Note: ArgoCD installation should be done separately after EKS is ready
# Use: terraform apply -target=module.vpc -target=module.ecr -target=module.eks
# Then: terraform apply (to install ArgoCD)