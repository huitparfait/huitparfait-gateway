'use strict';

const Boom = require('boom');
const config = require('../config/config');
const { setSessionCookie } = require('../session-cookie/session-cookie.helper');
const { upsertUser } = require('../users/users.api');

module.exports = {
  name: 'facebook.provider',
  async register (server, options) {

    const isProduction = config.get('NODE_ENV') === 'production';

    server.auth.strategy('facebook', 'bell', {
      provider: 'facebook',
      // Don't ask for email
      scope: [],
      password: config.get('OAUTH_BELL_COOKIE_PASSWORD'),
      clientId: config.get('FACEBOOK_APP_ID'),
      clientSecret: config.get('FACEBOOK_SECRET_KEY'),
      isSecure: isProduction,
      forceHttps: isProduction,
      location (request) {
        return request.headers['x-forwarded-host'] || '';
      },
    });

    server.route({
      method: 'GET',
      path: '/auth/facebook',
      config: {
        auth: 'facebook',
        async handler (request, h) {

          if (!request.auth.isAuthenticated) {
            return Boom.unauthorized('Authentication failed: ' + request.auth.error.message);
          }

          const facebookProfile = request.auth.credentials.profile;
          const userId = await upsertUser({
            provider: 'facebook',
            id: facebookProfile.id,
            name: facebookProfile.displayName,
            avatarUrl: facebookProfile.picture.data.url,
          });
          setSessionCookie(h, { userId });

          return h.redirect('/');
        },
      },
    });
  },
};
