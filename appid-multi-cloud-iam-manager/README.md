# App ID Multi Cloud Identity and Access Manager

## Setup

1. Update the config under `helm/config.yaml` with your service credentials

2. Deploy the helm chart

```
$ helm install --name mciapm --namespace multi-cloud-tech-preview-dashboard ./helm/appid-multi-cloud-manager -f ./helm/config.yaml
```