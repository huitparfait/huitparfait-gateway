'use strict';

const config = require('../config/config');

const FRONT_URL = config.get('FRONT_URL');

module.exports = {
  name: 'proxify-static.route',
  async register (server, options) {

    server.route({
      method: '*',
      path: '/{path*}',
      config: {
        auth: false,
        handler: {
          proxy: {
            passThrough: true,
            xforward: true,
            mapUri (request) {

              // Don't pass cookies to proxified API
              delete request.headers['cookie'];

              const queryParams = request.url.search || '';
              const uri = `${FRONT_URL}${request.path}${queryParams}`;

              return { uri };
            },
          },
        },
      },
    });
  },
};
