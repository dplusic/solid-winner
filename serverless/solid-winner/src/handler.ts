import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";

import { connect as connectDb } from "./db";
import * as User from "./Model/User";
import * as Section from "./Coordinates/Section";
import * as View from "./Coordinates/View";
import * as Point from "./Coordinates/Point";

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
  const userId = event.queryStringParameters!.userId;

  const user: User.User = {
    id: userId,
    name: userId,
    position: Point.origin
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
    .catch(e => {
      console.error(e);
      cb(e);
    });
};

export const getMap: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  const userId = event.queryStringParameters!.userId;

  const db = connectDb();

  db.get({
    table: "user",
    query: {
      id: userId
    }
  })
    .then(
      user =>
        user ? Promise.resolve(<User.User>user) : Promise.reject("No User")
    )
    .then(user => Section.intersectedSections(View.fromPoint(user.position)))
    .then(sections => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(sections)
      };

      cb(undefined, response);
    })
    .catch(e => {
      console.error(e);
      cb(e);
    });
};
