#!/bin/sh

APP_NAME=multi-cloud-tech-preview-hello-world-frontend
KUBE_NAMESPACE=multi-cloud-tech-preview

echo Updating Namespace
kubectl apply -f kubernetes/namespace.yaml

echo Updating Configmap
kubectl apply -f kubernetes/configmap.yaml

echo Updating Deployment
rm -f kubernetes/istio-deployment.yaml
~/istio-1.0.5/bin/istioctl kube-inject -f kubernetes/deployment.yaml > kubernetes/istio-deployment.yaml
kubectl delete deployment dpl-hello-world-frontend --namespace=${KUBE_NAMESPACE} --ignore-not-found=true
kubectl apply -f kubernetes/istio-deployment.yaml

echo Updating Services
kubectl apply -f kubernetes/service-web.yaml
kubectl apply -f kubernetes/service-api.yaml

echo Updating Service Entry
kubectl apply -f kubernetes/istio-serviceentry.yaml

echo Updating Gateway
kubectl apply -f kubernetes/istio-gateway.yaml

echo Updating Virtual Service
kubectl apply -f kubernetes/istio-virtual-service.yaml
