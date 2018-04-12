const express = require('express');
const graphqlHTTP = require('express-graphql');
const Schema = require('./schema/schema');
const mongodb = require('mongodb');
const config = require('./config.js');

async function init(config) {
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
  app.use('/graphql', graphqlHTTP({
    schema: Schema,
    rootValue: {},
    graphiql: true,
    context: {db},
    formatError: (err) => {
      console.log(err);
      return err;
    }
  }));
  app.listen(config.server.port);
  console.log('Running a GraphQL API server at localhost:4000/graphql');
}

init(config);