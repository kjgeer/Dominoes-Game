#!/bin/bash
set -e

echo " Starting Complete DevOps Setup from Scratch..."

# 1. Start Minikube
echo " Starting Minikube cluster..."
minikube start --nodes 2 --cpus 2 --memory 3072

# 2. Enable addons
echo " Enabling Minikube addons..."
minikube addons enable ingress
minikube addons enable metrics-server

# 3. Build Docker image
echo " Building Docker image..."
docker build -t dominoes-game:latest .

# 4. Load image to all Minikube nodes
echo " Loading image to Minikube..."
minikube image load dominoes-game:latest --daemon

# 5. Install ArgoCD
echo " Installing ArgoCD..."
kubectl create namespace argocd || true
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 6. Wait for ArgoCD
echo " Waiting for ArgoCD to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s

# 7. Get ArgoCD password
echo " Getting ArgoCD admin password..."
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo "ArgoCD Password: $ARGOCD_PASSWORD"

# 8. Deploy via Helm (NOT ArgoCD for now - simpler)
echo "⎈ Deploying with Helm..."
helm install dominoes-game helm/dominoes-game \
  -n dominoes-game --create-namespace \
  --set image.repository=dominoes-game \
  --set image.tag=latest \
  --set image.pullPolicy=Never

# 9. Wait for deployment
echo "⏳ Waiting for deployment..."
kubectl wait --for=condition=available --timeout=120s deployment/dominoes-game -n dominoes-game || true

# 10. Show status
echo " Setup complete!"
echo ""
echo " Status:"
kubectl get pods -n dominoes-game
echo ""
echo " To access your game:"
echo "   kubectl port-forward -n dominoes-game svc/dominoes-game 8080:80"
echo "   Then open: http://localhost:8080"
echo ""
echo " ArgoCD UI (optional):"
echo "   kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "   Then open: https://localhost:8080"
echo "   Username: admin"
echo "   Password: $ARGOCD_PASSWORD"