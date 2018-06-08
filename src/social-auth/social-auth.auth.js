'use strict';

const Bell = require('bell');
const facebook = require('./facebook.provider');
const google = require('./google.provider');
const twitter = require('./twitter.provider');

module.exports = {
  name: 'social-auth.auth',
  async register (server, options) {
    await server.register([
      Bell,
      facebook,
      google,
      twitter,
    ]);
  },
};
