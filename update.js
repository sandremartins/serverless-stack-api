import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' define a chave de partição e a chave de classificação do item a ser atualizado
    // - 'userId': Identity Pool id de identidade do usuário autenticado
    // - 'noteId': parâmetro de path
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    },
    // 'UpdateExpression' define os atributos a serem atualizados
    // 'ExpressionAttributeValues' define o valor na expressão de atualização
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":content": data.content || null
    },
    // 'ReturnValues' especifica se e como retornar os atributos do item,
    // onde ALL_NEW retorna todos os atributos do item após a atualização;
    // você pode inspecionar o 'result' abaixo para ver como funciona com diferentes configurações
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});