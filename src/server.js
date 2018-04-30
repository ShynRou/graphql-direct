const express = require('express');
const graphqlHTTP = require('express-graphql');
const Auth = require('./auth/auth');
const Schema = require('./schema/schema');
const mongodb = require('mongodb');
const config = require('./config.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

async function init(config) {
  global.config = config;

  const MongoClient = mongodb.MongoClient;
  let db;

  try {
    let client = await MongoClient.connect(config.db.url);
    db = client.db(config.db.database);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const app = express();
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));

  app.post('/auth/login',
    (request, response) => {
      try {
        const token = Auth.login(request.body.username, request.body.password, config.loginValidator);

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
  console.log('Running a GraphQL API server at localhost:'+config.server.port+'/graphql');
}

init(config);