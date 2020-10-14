import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' define a condição para a consulta
    // - 'userId = :userId': retorna apenas itens com a key de
    // partição 'userId' correspondente
    // 'ExpressionAttributeValues' define o valor na condição
    // - ':userId': define 'userId' como sendo o ID de Identity Pool
    // de identidade do usuário autenticado
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId
    }
  };

  const result = await dynamoDb.query(params);

  // Retorna a lista de itens correspondentes no response body
  return result.Items;
});