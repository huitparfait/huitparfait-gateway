'use strict';

const config = require('../config/config');
const crypto = require('crypto');
const request = require('superagent');
const { getJwtBearerHeader } = require('../utils/jwt');

const API_URL = config.get('API_URL');
const HMAC_KEY = config.get('HMAC_KEY');

async function upsertUser ({ provider, id, name, avatarUrl }) {

  // Use "anonymous" JWT Bearer token to prove the call went from the gateway
  const AuthorizationHeader = getJwtBearerHeader({ anonymous: true });
  const oauthHash = getOauthHash(provider, id);

  const { body: user } = await request
    .post(`${API_URL}/api/users/me`)
    .set('Authorization', AuthorizationHeader)
    .send({ oauthHash, name, avatarUrl });
  return user.id;
}

function getOauthHash (provider, id) {
  const hash = crypto.createHmac('sha512', HMAC_KEY);
  hash.update(`${provider}${id}`);
  return hash.digest('base64');
}

module.exports = { upsertUser };
