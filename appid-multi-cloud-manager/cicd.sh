#!/bin/sh

APP_NAME="mciapm"
HELM_RELEASE_NAME=${APP_NAME}01
KUBE_NAMESPACE=${APP_NAME}

echo Updating Namespace
kubectl create namespace ${KUBE_NAMESPACE}

echo Deploying Helm Chart
helm delete --purge ${HELM_RELEASE_NAME}
helm install --name ${HELM_RELEASE_NAME} helm/appid-multi-cloud-manager -f helm/config.yaml
