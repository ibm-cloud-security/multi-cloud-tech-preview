# Hello World Backend

> Backend application for [App ID Multi Cloud Demo](./INSERT DEMO LINK)

## What's this do?

The backend application of App ID Multi-Cloud Demo returns generic user information when authorized with an access token. It is meant to be paired with the App ID Istio mixer adapter to illustrate API protection using the Istio service mesh.

This app consists of a single API endpoint `/api/user/data` that returns generic information when provided with an access token.

Request:
```
GET /api/user/data
Authorization: Bearer <Access Token>
```

Responses
```
Status: 200 OK
Body: {
    total_donations: '$1234.56',
    locale: 'en-us'
}

Status: 401 Unauthorized
Occurs when authentication is rejected by Istio adapter


Status: 404 OK
Occurs when Istio API protection is disabled and no access token is provided to the endpoint
```

## Configure

1. Enure your kubectl environment to use your second cluster 
2. Navigate to `./kubernetes`
3. Inject the Istio sidecar into your deployment
    ```
    $ istioctl kube-inject -f deployment.yaml > istio-deployment.yaml
    ```

## Deploy

```
$ kubectl apply -f namespace.yaml 
$ kubectl apply -f istio-deployment.yaml 
$ kubectl apply -f service.yaml 
$ kubectl apply -f istio-gateway-virtual-service.yaml
$ kubectl apply -f istio-rule.yaml
```