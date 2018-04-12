const { getGraphQLUpdateArgs, getMongoDbUpdateResolver, getGraphQLQueryArgs, getMongoDbQueryResolver } = require('graphql-to-mongodb');
const { GraphQLList } = require('graphql');
const AcknowledgeType = require('./acknowledge.type');

const typeToArgs = (type, defaults = {}) => {
  let fields = type._typeConfig.fields;
  return Object.keys(fields)
    .reduce(
      (acc, field) => {
        acc[field] = {
          type: fields[field].type,
          defaultValue: defaults[field],
        };
        return acc;
      },
      {}
    );
};

const simpleCreateMutation = (collection, inputType) => {
  return {
    type: AcknowledgeType,
    args: typeToArgs(inputType),
    resolve: async (object, args, context, info) => {
      return (await context.db.collection(collection).insertOne(args)).result;
    }
  }
};

const simpleUpdateMutation = (collection, inputType) => {
  return {
    type: AcknowledgeType,
    args: getGraphQLUpdateArgs(inputType),
    resolve: getMongoDbUpdateResolver(
      inputType,
      async (filter, update, options, projection, source, args, context, info) => {
        const result = await context.db.collection(collection).updateMany(filter, update, options);
        return result.result;
      },
      true
    )
  }
};

const simpleDeleteMutation = (collection, inputType) => {
  return {
    type: AcknowledgeType,
    args: getGraphQLQueryArgs(inputType),
    resolve: getMongoDbQueryResolver(
      inputType,
      async (filter, projection, options, obj, args, context) => {
        return (await context.db.collection(collection).deleteMany(filter, options)).result;
      },
      true
    )
  };
};

const simpleQuery = (collection, inputType) => {
  return {
    type: new GraphQLList(inputType),
    args: getGraphQLQueryArgs(inputType),
    resolve: getMongoDbQueryResolver(
      inputType,
      async (filter, projection, options, obj, args, context) => {
        options.projection = projection;
        return await context.db.collection(collection).find(filter, options).toArray();
      }
    )
  };
};

module.exports = {
  typeToArgs,
  simpleQuery,
  simpleCreateMutation,
  simpleUpdateMutation,
  simpleDeleteMutation,
};