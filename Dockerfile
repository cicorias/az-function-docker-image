# Define a build-time argument with a default value.
# build with:
# docker build --build-arg BASE_IMAGE=ssh -t hellofunctions .
# or 
# docker build --build-arg BASE_IMAGE=nossh -t hellofunctions .
ARG BASE_IMAGE=nossh

FROM mcr.microsoft.com/azure-functions/node:4-node18-appservice as ssh_base
FROM mcr.microsoft.com/azure-functions/node:4-node18 as nossh_base

FROM ${BASE_IMAGE}_base

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY . /home/site/wwwroot

RUN cd /home/site/wwwroot && \
    npm ci && \
    npm run build