const ExampleType = require('../types/example.type');
const { simpleQuery, simpleCreateMutation, simpleUpdateMutation, simpleDeleteMutation } = require('../../helper/graphql.helper');

module.exports = {
  id: 'example',
  query: simpleQuery('example', ExampleType),
  mutation: {
    create: simpleCreateMutation('example', ExampleType),
    update: simpleUpdateMutation('example', ExampleType),
    delete: simpleDeleteMutation('example', ExampleType),
  }
};