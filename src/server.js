'use strict';

const Hapi = require('hapi');
const h2o2 = require('h2o2');
const routes = require('./routes');
const config = require('./config/config.js');

async function createServer () {
  const server = Hapi.server({
    port: config.get('PORT'),
  });
  await server.register({ plugin: h2o2 });
  server.route(routes);
  return server;
};

module.exports = { createServer };
