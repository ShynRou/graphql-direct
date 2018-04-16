const Auth = require('../../auth/auth');
const ExampleType = require('../types/example.type');
const { simpleQuery, simpleCreateMutation, simpleUpdateMutation, simpleDeleteMutation, guard } = require('../../helper/graphql.helper');


module.exports = {
  id: 'example',
  query: simpleQuery('example', ExampleType),
  mutation: {
    create: simpleCreateMutation('example', ExampleType),
    update: simpleUpdateMutation('example', ExampleType),
    delete: guard([], simpleDeleteMutation('example', ExampleType)),
  }
};