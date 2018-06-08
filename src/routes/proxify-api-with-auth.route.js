'use strict';

const config = require('../config/config');
const { getJwtBearerHeader } = require('../utils/jwt');

const API_URL = config.get('API_URL');

module.exports = {
  name: 'proxify-with-auth.route',
  async register (server, options) {

    server.route({
      method: '*',
      path: '/api/{path*}',
      config: {
        auth: 'session-cookie',
        handler: {
          proxy: {
            passThrough: true,
            xforward: true,
            mapUri (request) {

              // Retrieve userId from session
              const userId = request.auth.credentials.userId;

              // Don't pass cookies to proxified API
              delete request.headers['cookie'];

              // Auth with JWT Bearer token on proxified API
              const AuthorizationHeader = getJwtBearerHeader({ sub: userId });
              request.headers['Authorization'] = AuthorizationHeader;

              const queryParams = request.url.search || '';
              const uri = `${API_URL}${request.path}${queryParams}`;

              return { uri };
            },
          },
        },
      },
    });
  },
};
