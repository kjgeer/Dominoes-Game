# Create ArgoCD namespace
resource "kubernetes_namespace" "argocd" {
  metadata {
    name = var.argocd_namespace
  }
}

# Install ArgoCD using Helm
resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  version    = var.argocd_version
  namespace  = kubernetes_namespace.argocd.metadata[0].name

  values = [
    yamlencode({
      global = {
        domain = "argocd.${var.cluster_name}.local"
      }

      configs = {
        params = {
          "server.insecure" = true
        }
      }

      server = {
        service = {
          type = "LoadBalancer"
        }
        extraArgs = [
          "--insecure"
        ]
      }

      controller = {
        metrics = {
          enabled = true
        }
      }

      repoServer = {
        metrics = {
          enabled = true
        }
      }

      redis = {
        metrics = {
          enabled = true
        }
      }
    })
  ]

  depends_on = [kubernetes_namespace.argocd]
}

# Wait for ArgoCD server to be ready
resource "time_sleep" "wait_for_argocd" {
  depends_on = [helm_release.argocd]

  create_duration = "60s"
}