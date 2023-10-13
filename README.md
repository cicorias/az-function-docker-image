## Running the Azure Function Image Locally 

Simple Build:

```shell
docker buildx build --build-arg BASE_IMAGE=ssh -t hellofunctions 
```

Now run it passing in ENV varaibles to a reachable storage account from your environment. 

```shell

AZURE_STORAGE_CONNECTION="...."
IMAGE_NAME="shawnfnimage"
IMAGE_TAG="v1.0.001"`
ACR_REGISTRY_NAME="..."
APP_FUNCTION_APP_NAME="..."

 docker run --rm -it -p 2222:2222/tcp -p 80:80/tcp -e function_auth_level=anonymous -e FUNCTIONS_WORKER_RUNTIME="node" -e AzureWebJobsFeatureFlags="EnableWorkerIndexing" -e AzureWebJobsStorage="${AZURE_STORAGE_CONNECTION}" -e storage_dossier="${AZURE_STORAGE_CONNECTION}" -e extraction_queue="${AZURE_STORAGE_CONNECTION}" -e storage_dossier_host="http://127.0.0.1:10000/devstoreaccount1/"    "${ACR_REGISTRY_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG}"


```

## Example Build and Publish

```shell

az acr login -n ${ACR_REGISTRY_NAME}
docker buildx build --build-arg BASE_IMAGE=ssh -t "${ACR_REGISTRY_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG}" .
docker push "${ACR_REGISTRY_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG}"
```

## Az Funnction zip publish

```shell
APP_FUNCTION_APP_NAME=".."
npm run clean && \
    npm run build && \
    func azure functionapp publish ${APP_FUNCTION_APP_NAME} --show-keys --force --build remote
```

## Update an Image in the Registry

[Update an image in the registry](https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-custom-container?tabs=core-tools%2Cacr%2Cazure-cli&pivots=azure-functions#update-an-image-in-the-registry)

```shell

az acr build --registry ${ACR_REGISTRY_NAME} --image "${ACR_REGISTRY_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG}" .
```

## Update the Function app to the new Image

```shell
# ??
az functionapp config container set \
    --image "${ACR_REGISTRY_NAME}.azurecr.io/${IMAGE_NAME}:${IMAGE_TAG}" \
    --name "${APP_FUNCTION_APP_NAME}" --resource-group "${AZURE_RESOURCE_GROUP}"
```



# Notes

- Master key running local: [https://github.com/Azure/azure-functions-host/issues/4147](https://github.com/Azure/azure-functions-host/issues/4147)