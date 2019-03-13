# Hello World Frontend

> Frontend application for [App ID Multi Cloud Demo](./INSERT DEMO LINK)

## What's this do?

The frontend application of App ID Multi-Cloud Demo acts as the entry point to the Hello World Microservice system. 

This app consists of several endpoint which are Web or API protected:

#### Web Protected

Get `/`:

    Returns JSON payload containing a hello message and user info retrieved from the backend.

    ```
    // CASE 1
    //   Protection is enabled on Frontend and Backend
    //   User is authenticated on both the front and backend
    {
        "msg": "Hello Authorized User", // Names are pulled from token `name` claim. If no name exists, "Authorized User" is used in its place
        "userInfo": {
            "locale": "en-us"
        }
    }

    // CASE 2
    //   Protection is not enabled on the Frontend or Backend
    {
        "msg": "Hello anonymous user",
        "error": "User not found"
    }

    // CASE 3
    //   Protection is not enabled on the Frontend, but enabled on the backend
    {
        "msg": "Hello anonymous user",
        "error": "Unauthorized"
    }

    // CASE 4
    //   Protection is enabled on the Frontend, but not on the Backend
    {
        "msg": "Hello Authorized User",
        "userInfo": {
            "locale": "en-us"
        }
    }
    
    ```

GET `/api/user/data`:

    Acts as a proxy endpoint to the backend. Used in order to retrieve tokens (if the exist) from the session.

#### API Protected

GET `/api/is_protected`:

    Acts as a proxy endpoint to the backend. Used in order to retrieve tokens (if the exist) from the session.

GET `/api/auth_context`:

    Convenience endpoints that returns the current user's authorization context

    ```
        {
            "accessToken": '',
            "accessTokenPayload": '',
            "identityToken": '',
            "identityTokenPayload": '',
        }
    ```

## Web App Strategy

As of Istio 1.0.5, Istio does not support the ability for Mixer based redirect flows. This prevents Mixer initiated OAuth flows. This is in active development and should be a part of one of the next few releases.

As a workaround, the deployment uses two services to access the application. When a request comes in to a Web protected endpoint, it immediately calls its own `/api/is_protected` endpoint through a separate Kubernetes service in order to determine whether or not to initiate a redirect.

This workaround is handled by the `./middleware/web-strategy-middleware`

## Deploy Your Application to Kubernetes

### Configure your environment

1. Modify template `./kubernetes/configmap.yaml` to include the following:

    ```
    # Your App ID Credentials
    tenant_id: "f3034232-dddd-cccc-bbbb-aaaaaaaaaaaa"
    client_id: "9cf21234-cccc-dddd-aaaa-123456678910"
    secret: "RCQyZWZjM4L0o2U1Yy00OGZmLTg2Ymfd1zU4YzI0MzE5Nj12"
    appid_url: "https://appid-oauth.ng.bluemix.net/oauth/v3/f3034232-dddd-cccc-bbbb-aaaaaaaaaaaa"
    
    # Public clsuter URL to your backend application
    backend_url: "http://174.193.112.163:31380"
    
    # Public URL to the frontend application
    public_web_url: "http://158.48.115.235"
    ```

### Configure Istio

1. Enure your kubectl environment to use your second cluster 
2. Navigate to `./kubernetes`
3. Inject the Istio sidecar into your deployment
    ```
    $ istioctl kube-inject -f deployment.yaml > istio-deployment.yaml
    ```

### Deploy

```
$ cd ./kubernetes
$ kubectl apply -f namespace.yaml
$ kubectl apply -f configmap.yaml 
$ kubectl apply -f istio-deployment.yaml 
$ kubectl apply -f service-api.yaml 
$ kubectl apply -f service-web.yaml 
$ kubectl apply -f istio-gateway.yaml
$ kubectl apply -f istio-virtual-service.yaml
$ kubectl apply -f istio-serviceentry.yaml
```