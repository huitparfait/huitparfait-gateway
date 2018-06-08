'use strict';

const Boom = require('boom');
const sessionStore = require('./session-store');
const { destroyCookies, readSessionId } = require('./session-cookie.helper');

module.exports = {
  name: 'session-cookie.auth',
  async register (server, options) {

    server.auth.scheme('session-cookie', (server, options) => {
      return {
        async authenticate (request, h) {

          const sessionId = readSessionId(request);
          const csrfToken = request.headers['x-csrf'];

          if (sessionId == null) {
            destroyCookies(h);
            throw Boom.unauthorized('No session id cookie was received!');
          }

          const session = await sessionStore.get(sessionId);
          if (session == null) {
            destroyCookies(h);
            throw Boom.unauthorized('Invalid session id!');
          }

          if (session.csrfToken !== csrfToken) {
            throw Boom.unauthorized('Invalid csrf token!');
          }

          return h.authenticated({ credentials: { userId: session.userId } });
        },
      };
    });

    server.auth.strategy('session-cookie', 'session-cookie');

    server.route({
      method: 'POST',
      path: '/auth/logout',
      config: {
        auth: 'session-cookie',
        async handler (request, h) {
          const sessionId = readSessionId(request);
          sessionStore.destroy(sessionId);
          destroyCookies(h);
          return Boom.unauthorized();
        },
      },
    });
  },
};
