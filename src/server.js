const express = require('express');
const graphqlHTTP = require('express-graphql');
const Auth = require('./auth/auth');
const Schema = require('./schema/schema');
const mongodb = require('mongodb');
const config = require('./config.js');
const cookieParser = require('cookie-parser');

async function init(config) {
  global.config = config;

  const MongoClient = mongodb.MongoClient;
  let db;

  try {
    db = await new Promise(function (resolve, reject) {
      MongoClient.connect(config.db.url, function (err, client) {
        if (err) return reject(err);
        return resolve(client.db(config.db.database));
      });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const app = express();
  app.use(cookieParser());

  app.get('/auth/login',
    (request, response) => {
      try {
        const token = Auth.login('user', 'pass', () => []);

        if (token) {
          response.cookie('token', token);
          return response.send({ ok: true });
        }
        else {
          return response.send({ ok: false });
        }
      } catch (error) {
        console.error(error);
        return response.send({ ok: false });
      }
    }
  );


  app.use('/graphql',
    graphqlHTTP(async (request, response, graphQLParams) => {
      let token;
      if (request.cookies && request.cookies.token) {
        token = Auth.verify(request.cookies.token);
      }
      return {
        schema: Schema,
        rootValue: {},
        graphiql: true,
        context: { db, token },
        formatError: (err) => {
          console.log(err);
          return err;
        }
      };
    })
  );
  app.listen(config.server.port);
  console.log('Running a GraphQL API server at localhost:4000/graphql');
}

init(config);