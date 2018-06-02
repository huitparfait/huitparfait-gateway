'use strict';

const Hapi = require('hapi');
const h2o2 = require('h2o2');
const routes = require('./routes');

async function createServer (port) {
  const server = Hapi.server({ port });
  await server.register({ plugin: h2o2 });
  server.route(routes);
  return server;
};

module.exports = { createServer };
