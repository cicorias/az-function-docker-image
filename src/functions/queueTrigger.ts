import { app, input, InvocationContext, output } from "@azure/functions";

const cosmosInput = input.cosmosDB({
    databaseName: 'MyDatabase',
    collectionName: 'MyCollection',
    id: '{queueTrigger}',
    partitionKey: '{queueTrigger}',
    connectionStringSetting: 'MyAccount_COSMOSDB',
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'MyDatabase',
    collectionName: 'MyCollection',
    createIfNotExists: false,
    partitionKey: '{queueTrigger}',
    connectionStringSetting: 'MyAccount_COSMOSDB',
});

interface MyDocument {
    text: string;
}

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