
module.exports = {
  // DEFAULT CONFIG
  db: {
    url: 'mongodb://localhost:27017/',
    database: 'example'
  },
  server: {
    port: 4000,
  },

  // CUSTOM CONFIG
  // TODO: implement an environment switch
  ...require('./config.json'),
};