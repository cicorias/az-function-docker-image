import { app, input, InvocationContext, output } from "@azure/functions";

const cosmosInput = input.cosmosDB({
    databaseName: 'APP_COSMOS_DATABASE_NAME',
    collectionName: 'APP_COSMOS_COLLECTION_NAME',
    id: '{queueTrigger}',
    partitionKey: '{queueTrigger}',
    connectionStringSetting: 'APP_COSMOS_CONNECTION_STRING',
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'APP_COSMOS_DATABASE_NAME',
    collectionName: 'APP_COSMOS_COLLECTION_NAME',
    createIfNotExists: false,
    partitionKey: '{queueTrigger}',
    connectionStringSetting: 'APP_COSMOS_CONNECTION_STRING',
});

interface MyDocument {
    text: string;
}
// TODO: review https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-input?pivots=programming-language-javascript&tabs=python-v2%2Cisolated-process%2Cnodejs-v4%2Cextensionv4
export async function storageQueueTrigger1(queueItem: unknown, context: InvocationContext): Promise<void> {

    const doc = <MyDocument>context.extraInputs.get(cosmosInput); // TODO: can take id? node_modules/@azure/functions/types/cosmosDB.v4.d.ts
    doc.text = 'This was updated!';
    context.extraOutputs.set(cosmosOutput, doc);
}

app.storageQueue('storageQueueTrigger1', {
    queueName: 'outqueue',
    connection: 'MyStorageConnectionAppSetting',
    extraInputs: [cosmosInput],
    extraOutputs: [cosmosOutput],
    handler: storageQueueTrigger1,
});