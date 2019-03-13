#!/bin/sh

APP_NAME=multi-cloud-tech-preview-hello-world-backend
KUBE_NAMESPACE=multi-cloud-tech-preview

echo Updating Namespace
kubectl apply -f kubernetes/namespace.yaml

echo Updating Deployment
rm -f kubernetes/istio-deployment.yaml
istioctl kube-inject -f kubernetes/deployment.yaml > kubernetes/istio-deployment.yaml
kubectl delete deployment dpl-${APP_NAME} --namespace=${KUBE_NAMESPACE} --ignore-not-found=true
kubectl apply -f kubernetes/istio-deployment.yaml

echo Updating Backend Service
kubectl apply -f kubernetes/service.yaml

echo Deploying Ingress
kubectl apply -f kubernetes/istio-gateway-virtual-service.yaml

echo Deploy Rule
kubectl apply -f kubernetes/istio-rule.yaml
