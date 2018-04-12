const {GraphQLObjectType, GraphQLBoolean, GraphQLInt} = require('graphql');

const AcknowledgeType = new GraphQLObjectType({
  name: 'AcknowledgeType',
  fields: {
    ok: {
      type: GraphQLBoolean
    },
    n: {
      type: GraphQLInt,
    },
    nModified: {
      type: GraphQLInt,
    },
  }
});

module.exports = AcknowledgeType;