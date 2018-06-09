'use strict';

const config = require('./config/config.js');
const forceHttps = require('hapi-require-https');
const Good = require('good');
const h2o2 = require('h2o2');
const Hapi = require('hapi');
const prefixWww = require('./prefix-www');
const proxifyApiWithAuth = require('./routes/proxify-api-with-auth.route');
const proxifyFront = require('./routes/proxify-front.route');
const sessionCookieAuth = require('./session-cookie/session-cookie.auth');
const socialAuth = require('./social-auth/social-auth.auth');

const isProduction = config.get('NODE_ENV') === 'production';

async function createServer () {
  const server = Hapi.server({
    port: config.get('PORT'),
    routes: {
      security: {
        hsts: {
          maxAge: 42 * 24 * 60 * 60,
          includeSubDomains: true,
        },
        xframe: 'deny',
        xss: true,
        referrer: 'same-origin',
      },
    },
  });
  await server.register([
    socialAuth,
    sessionCookieAuth,
    h2o2,
    proxifyApiWithAuth,
    proxifyFront,
    {
      plugin: Good,
      options: {
        ops: {
          interval: 1000,
        },
        reporters: {
          console: [
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{ log: '*', error: '*' }],
            },
            {
              module: 'good-console',
            },
            'stdout',
          ],
        },
      },
    },
  ]);
  if (isProduction) {
    await server.register([
      forceHttps,
      prefixWww,
    ]);
  }
  return server;
};

module.exports = { createServer };
