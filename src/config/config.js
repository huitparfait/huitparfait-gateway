'use strict';

const convict = require('convict');

const conf = convict({
  NODE_ENV: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  PORT: {
    doc: 'The port on which the server is running',
    format: Number,
    default: 3000,
    env: 'PORT',
  },
  API_URL: {
    doc: 'The URL of the API to proxify',
    format: String,
    required: true,
    default: null,
    env: 'API_URL',
  },
  OAUTH_BELL_COOKIE_PASSWORD: {
    doc: 'Password used by bell (and iron) to encrypt cookies during oAuth dance',
    format: String,
    required: true,
    default: null,
    env: 'OAUTH_BELL_COOKIE_PASSWORD',
  },
  HMAC_KEY: {
    doc: 'Key used to hash "oAuthProvider"+"oAuthId" which is used as a unique user id',
    format: String,
    required: true,
    default: null,
    env: 'HMAC_KEY',
  },
  REDIS_HOST: {
    doc: 'Host to access redis instance',
    format: String,
    required: true,
    default: null,
    env: 'REDIS_HOST',
  },
  REDIS_PORT: {
    doc: 'Port to access redis instance',
    format: Number,
    required: true,
    default: null,
    env: 'REDIS_PORT',
  },
  REDIS_PASSWORD: {
    doc: 'Password to access redis instance',
    format: String,
    required: true,
    default: null,
    env: 'REDIS_PASSWORD',
  },
  JWT_PRIVATE_KEY: {
    doc: 'The RS512 public key to sign JWT tokens.',
    format: String,
    required: true,
    default: null,
    env: 'JWT_PRIVATE_KEY',
  },
  FACEBOOK_APP_ID: {
    doc: 'Facebook oAuth: App id',
    format: String,
    required: true,
    default: null,
    env: 'FACEBOOK_APP_ID',
  },
  FACEBOOK_SECRET_KEY: {
    doc: 'Facebook oAuth: Secret key',
    format: String,
    required: true,
    default: null,
    env: 'FACEBOOK_SECRET_KEY',
  },
  GOOGLE_CLIENT_ID: {
    doc: 'Google oAuth: Client id',
    format: String,
    required: true,
    default: null,
    env: 'GOOGLE_CLIENT_ID',
  },
  GOOGLE_CLIENT_SECRET: {
    doc: 'Google oAuth: Client secret',
    format: String,
    required: true,
    default: null,
    env: 'GOOGLE_CLIENT_SECRET',
  },
  TWITTER_CONSUMER_KEY: {
    doc: 'Twitter oAuth: Consumer Key (API Key)',
    format: String,
    required: true,
    default: null,
    env: 'TWITTER_CONSUMER_KEY',
  },
  TWITTER_CONSUMER_SECRET: {
    doc: 'Twitter oAuth: Consumer Secret (API Secret)',
    format: String,
    required: true,
    default: null,
    env: 'TWITTER_CONSUMER_SECRET',
  },
});

if (conf.get('NODE_ENV') === 'development') {
  conf.loadFile('./src/config/config.dev.json');
}

module.exports = conf;
