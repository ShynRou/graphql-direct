
module.exports = {
  // DEFAULT CONFIG
  db: {
    url: 'mongodb://localhost:27017/',
    database: 'example'
  },
  server: {
    port: 4000,
  },
  auth: { // REPLACE EVERYTHING HERE
    secret: 'V3§SylaR"-_94s1f{/)_Pgx>L[?MYq615A\'H.rZqWUul(n6e"nnW,9/u_KZ3y<=]',
    ttl: 3600,
    loginValidator: (username, password) => []
  },
};