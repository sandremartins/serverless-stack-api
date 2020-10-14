import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'Key' define a chave de partição e a chave de classificação do item a ser recuperado
    // - 'userId': IID de identidade do pool de identidade do usuário autenticado
    // - 'noteId': parametro path
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  const result = await dynamoDb.get(params);
  if ( ! result.Item) {
    throw new Error("Item not found.");
  }

  // Retorna o item recuperado
  return result.Item;
});
