'use strict';

const config = require('../config/config');
const jwt = require('jsonwebtoken');

const JWT_PRIVATE_KEY = config.get('JWT_PRIVATE_KEY');

function getJwtBearerHeader (payload, expiresInSeconds = 10) {
  const token = jwt.sign(payload, JWT_PRIVATE_KEY, {
    algorithm: 'RS512',
    expiresIn: expiresInSeconds,
  });
  return `Bearer ${token}`;
}

module.exports = { getJwtBearerHeader };
