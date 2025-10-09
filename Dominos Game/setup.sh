#!/bin/bash
set -e

echo "🚀 Starting Dominoes Game Deployment..."

# Enable addons
echo "📦 Enabling Minikube addons..."
minikube addons enable ingress
minikube addons enable metrics-server

# Wait for ingress controller
echo "⏳ Waiting for ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s || true

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t dominoes-game:latest .

# Load into Minikube
echo "📥 Loading image into Minikube..."
minikube image load dominoes-game:latest

# Uninstall if exists
echo "🧹 Cleaning up previous installation..."
helm uninstall dominoes-game -n dominoes-game 2>/dev/null || true
kubectl delete namespace dominoes-game 2>/dev/null || true
sleep 5

# Install with Helm
echo "⎈ Installing with Helm..."
helm install dominoes-game helm/dominoes-game \
  --create-namespace \
  --namespace dominoes-game \
  --set image.repository=dominoes-game \
  --set image.tag=latest \
  --set image.pullPolicy=Never

# Wait for deployment
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=120s \
  deployment/dominoes-game -n dominoes-game

# Show status
echo "✅ Deployment complete!"
kubectl get all -n dominoes-game

echo ""
echo "🎮 To access your game, run ONE of these commands:"
echo ""
echo "   kubectl port-forward -n dominoes-game svc/dominoes-game 8080:80"
echo "   Then visit: http://localhost:8080"
echo ""
echo "   OR"
echo ""
echo "   minikube service dominoes-game -n dominoes-game"
echo ""