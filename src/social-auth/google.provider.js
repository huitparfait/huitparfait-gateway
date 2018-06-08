'use strict';

const Boom = require('boom');
const config = require('../config/config');
const { setSessionCookie } = require('../session-cookie/session-cookie.helper');
const { upsertUser } = require('../users/users.api');

module.exports = {
  name: 'google.provider',
  async register (server, options) {

    const isProduction = config.get('NODE_ENV') === 'production';

    server.auth.strategy('google', 'bell', {
      provider: 'google',
      scope: ['profile'],
      password: config.get('OAUTH_BELL_COOKIE_PASSWORD'),
      clientId: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      isSecure: isProduction,
      forceHttps: isProduction,
      location (request) {
        return request.headers['x-forwarded-host'] || '';
      },
    });

    server.route({
      method: 'GET',
      path: '/auth/google',
      config: {
        auth: 'google',
        async handler (request, h) {

          if (!request.auth.isAuthenticated) {
            return Boom.unauthorized('Authentication failed: ' + request.auth.error.message);
          }

          const googleProfile = request.auth.credentials.profile;
          const userId = await upsertUser({
            provider: 'google',
            id: googleProfile.id,
            name: googleProfile.displayName,
            avatarUrl: googleProfile.raw.picture,
          });
          setSessionCookie(h, { userId });

          return h.redirect('/');
        },
      },
    });
  },
};
