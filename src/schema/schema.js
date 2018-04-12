const glob = require('glob');
const path = require('path');
const { GraphQLSchema, GraphQLObjectType } = require('graphql');


const findFiles = () =>
  glob.sync('/**/*.action.js', { root: __dirname })
    .sort()
    .map(function (file) {
      return query = require(path.resolve(__dirname, file));
    });

const actions = findFiles();

const rootQuery = new GraphQLObjectType({
  name: 'root_query',
  fields: actions.reduce((acc, action) => {
    acc[action.id] = action.query;
    return acc;
  }, {})
});

const rootMutation = new GraphQLObjectType({
  name: 'root_mutation',
  fields: actions.reduce((acc, action) => {
    for (let key in action.mutation) {
      acc[key+'_'+action.id] = action.mutation[key];
    }
    return acc;
  }, {})
});

const Schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
  subscription: undefined, // TODO: Find a solution for Subscriptions
});

module.exports = Schema;