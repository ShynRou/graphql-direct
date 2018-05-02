const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull} = require('graphql');

const ExampleType = new GraphQLObjectType({
  name: 'ExampleType',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    first_name: {
      type: GraphQLString
    },
    last_name: {
      type: GraphQLString
    },
    display_name: {
      type: GraphQLString,
      resolve: (obj) => `${obj.first_name} ${obj.last_name}`,
      dependencies: ['first_name', 'last_name'],
    }
  }
});

module.exports = ExampleType;