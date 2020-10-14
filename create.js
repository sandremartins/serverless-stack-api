import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

//AWS.config.update({ region: "sa-east-1" });
//const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = handler(async (event, context) => {
  // Request body é passado como uma string codificada em 'event.body'
  const data = JSON.parse(event.body);
  console.log('Iniciando teste no processo.');
  console.log(process);
  console.log('Iniciando teste no processo .env');
  console.log(process.env);
  console.log('Agora, testando o nome da tabela.');
  console.log(process.env.tableName);
  console.log('Fim do teste.');

  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  console.log('authProvider');
  console.log(authProvider);
  // O provedor de autenticação Cognito se parece com:
  // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_aaaaaaaaa:CognitoSignIn:qqqqqqqq-1111-2222-3333-rrrrrrrrrrrr
  // Where us-east-1_aaaaaaaaa is the User Pool id
  // And qqqqqqqq-1111-2222-3333-rrrrrrrrrrrr is the User Pool User Id

  const params = {
    TableName: process.env.tableName,
    // 'Item' contém os atributos do item a ser criado
    // - 'userId': identidades de usuário são associados
    //                 por meio do Cognito Identity Pool,
    //                 usaremos o id de identidade como o id do usuário autenticado
    // - 'noteId': uma unica uuid
    // - 'content': vêm do request body
    // - 'attachment': vêm do request body
    // - 'createdAt': Unix timestamp atual
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});