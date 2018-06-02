'use strict';

const config = require('./config/config');
const { createServer } = require('./server');

const port = config.get('PORT');

createServer(port)
  .then((server) => server.start())
  .then((server) => console.log(`Server running at: ${server.info.uri}`))
  .catch((e) => console.log('Failed to start server', e));

module.process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
