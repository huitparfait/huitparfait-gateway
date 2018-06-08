'use strict';

const Boom = require('boom');
const config = require('../config/config');
const { setSessionCookie } = require('../session-cookie/session-cookie.helper');
const { upsertUser } = require('../users/users.api');

module.exports = {
  name: 'twitter.provider',
  async register (server, options) {

    const isProduction = config.get('NODE_ENV') === 'production';

    server.auth.strategy('twitter', 'bell', {
      provider: 'twitter',
      password: config.get('OAUTH_BELL_COOKIE_PASSWORD'),
      clientId: config.get('TWITTER_CONSUMER_KEY'),
      clientSecret: config.get('TWITTER_CONSUMER_SECRET'),
      isSecure: isProduction,
      forceHttps: isProduction,
      location (request) {
        return request.headers['x-forwarded-host'] || '';
      },
    });

    server.route({
      method: 'GET',
      path: '/auth/twitter',
      config: {
        auth: 'twitter',
        async handler (request, h) {

          if (!request.auth.isAuthenticated) {
            return Boom.unauthorized('Authentication failed: ' + request.auth.error.message);
          }

          const twitterProfile = request.auth.credentials.profile;
          const userId = await upsertUser({
            provider: 'twitter',
            id: twitterProfile.id,
            name: twitterProfile.displayName,
            avatarUrl: twitterProfile.raw.profile_image_url_https,
          });
          setSessionCookie(h, { userId });

          return h.redirect('/');
        },
      },
    });
  },
};
