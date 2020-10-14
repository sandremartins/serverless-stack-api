import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'Key' define a chave de partição e a chave de classificação do item a ser removido
    // - 'userId': Identity Pool id de identidade do usuário autenticado
    // - 'noteId': parâmetro path
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  await dynamoDb.delete(params);

  return { status: true };
});