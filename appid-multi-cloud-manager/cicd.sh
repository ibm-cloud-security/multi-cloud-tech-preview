#!/bin/sh

APP_NAME="mciapm"
IBM_CLOUD_NAMESPACE="default"
HELM_RELEASE_NAME=${APP_NAME}01
KUBE_NAMESPACE=${APP_NAME}
BUILD_ID_FILE="build_id"
TARGET_CLUSTER_KUBECONFIG="/Users/antona/.bluemix/plugins/container-service/clusters/antona/kube-config-dal13-antona.yml"

#typeset -i BUILD_ID=$(cat $BUILD_ID_FILE)
#echo $[BUILD_ID + 1] > $BUILD_ID_FILE
#echo Starting to Build and Deploy. build_id :: $BUILD_ID
BUILD_ID=latest

IMAGE_NAME=${APP_NAME}
IMAGE_VERSION=${BUILD_ID}
IMAGE_REGISTRY_NAMESPACE="antonal80"
IMAGE_TAG=${IMAGE_REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_VERSION}

echo Building the app
cd backend
npm run build

echo Building Image
docker build --rm -t ${IMAGE_TAG} .
cd ..

echo Pushing image to Container Registry
docker push ${IMAGE_TAG}

echo Targeting default IBM Cloud namespace
ic target -g ${IBM_CLOUD_NAMESPACE}

echo Targeting Cluster
export KUBECONFIG=${TARGET_CLUSTER_KUBECONFIG}

echo Updating Namespace
kubectl create namespace ${KUBE_NAMESPACE}

echo Updating TLS Secret
kubectl get secret antona --namespace=default --export -o yaml | kubectl apply --namespace=${KUBE_NAMESPACE} -f -

echo Deploying Helm Chart
helm delete --purge ${HELM_RELEASE_NAME}
helm install --name ${HELM_RELEASE_NAME} helm/appid-multi-cloud-manager -f helm/antona.yaml
