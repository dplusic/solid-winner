import * as AWS from "aws-sdk";

const getConfig = () =>
  process.env.NODE_ENV === "development"
    ? {
        region: "ap-northeast-2",
        endpoint: `http://localhost:${process.env.DYNAMODB_PORT}`
      }
    : undefined;

const toDynamoDbTableName = (table: string) =>
  `${process.env.SERVICE_NAME}-${table}-${process.env.SERVERLESS_STAGE}`;

export const connect = () => {
  const client = new AWS.DynamoDB.DocumentClient(getConfig());

  return {
    put: ({ table, data }: { table: string; data: object }) =>
      client
        .put({
          TableName: toDynamoDbTableName(table),
          Item: data
        })
        .promise()
  };
};
