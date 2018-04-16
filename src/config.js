
module.exports = {
  // DEFAULT CONFIG
  db: {
    url: 'mongodb://localhost:27017/',
    database: 'example'
  },
  server: {
    port: 4000,
  },
  auth: {
    //privateKey: 'V3§SylaR"-_94s1f{/)_Pgx>L[?MYq615A\'H.rZqWUul(n6e"nnW,9/u_KZ3y<=]',
    //ttl: 3600
  },

  // CUSTOM CONFIG
  // TODO: implement an environment switch
  ...require('./config.json'),
};