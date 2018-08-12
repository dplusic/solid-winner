import * as AWS from "aws-sdk";

const getConfig = () =>
  process.env.NODE_ENV === "development"
    ? {
        region: "ap-northeast-2",
        endpoint: `http://localhost:${process.env.DYNAMODB_LOCAL_PORT}`
      }
    : undefined;

const toDynamoDbTableName = (table: string) =>
  `${process.env.SERVICE_NAME}-${table}-${process.env.SERVERLESS_STAGE}`;

export const connect = () => {
  const client = new AWS.DynamoDB.DocumentClient(getConfig());

  return {
    put: <D>({
      table,
      data,
      ifValueNotExists
    }: {
      table: string;
      data: D;
      ifValueNotExists?: string;
    }) =>
      client
        .put({
          TableName: toDynamoDbTableName(table),
          Item: data,
          ConditionExpression: ifValueNotExists
            ? `attribute_not_exists(${ifValueNotExists})`
            : undefined
        })
        .promise(),

    get: <D>({
      table,
      query
    }: {
      table: string;
      query: object;
    }): Promise<D | null> =>
      client
        .get({ TableName: toDynamoDbTableName(table), Key: query })
        .promise()
        .then(r => <D | null>r.Item),

    batchGet: <D>({
      table,
      queries
    }: {
      table: string;
      queries: object[];
    }): Promise<D[]> =>
      client
        .batchGet({
          RequestItems: {
            [toDynamoDbTableName(table)]: {
              Keys: queries
            }
          }
        })
        .promise()
        .then(
          r => (r.Responses ? <D[]>r.Responses[toDynamoDbTableName(table)] : [])
        )
  };
};
