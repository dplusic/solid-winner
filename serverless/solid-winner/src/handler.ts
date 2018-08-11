import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";

import { connect as connectDb } from "./db";

export const hello: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
      input: event
    })
  };

  cb(undefined, response);
};

export const putUser: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  const body = JSON.parse(event.body!);

  const user = {
    id: body.id,
    name: body.id,
    position: {
      x: 0,
      y: 0
    }
  };

  connectDb()
    .put({
      table: "user",
      data: user
    })
    .then(() => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(user)
      };

      cb(undefined, response);
    })
    .catch(e => console.error(e));
};
