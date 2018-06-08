'use strict';

const config = require('../config/config');
const jwt = require('jsonwebtoken');

const JWT_PRIVATE_KEY = config.get('JWT_PRIVATE_KEY');

function getJwtBearerHeader (payload) {
  const token = jwt.sign(payload, JWT_PRIVATE_KEY, {
    algorithm: 'RS512',
    expiresIn: 10,
  });
  return `Bearer ${token}`;
}

module.exports = { getJwtBearerHeader };
