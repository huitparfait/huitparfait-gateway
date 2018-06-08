'use strict';

const config = require('../config/config');
const generateUuid = require('uuid').v4;
const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient({
  host: config.get('REDIS_HOST'),
  port: config.get('REDIS_PORT'),
  password: config.get('REDIS_PASSWORD'),
});

const getAsync = promisify(redisClient.get).bind(redisClient);

const SESSION_DURATION = 24 * 60 * 60;

function createSession (session) {
  const sessionId = generateUuid();
  const jsonSession = JSON.stringify(session);
  redisClient.set(sessionId, jsonSession, 'EX', SESSION_DURATION);
  return sessionId;
}

async function getSession (sessionId) {
  const jsonSession = await getAsync(sessionId);
  try {
    const session = JSON.parse(jsonSession);
    return session;
  }
  catch (e) {
    destroySession(sessionId);
    return null;
  }
}

function destroySession (sessionId) {
  redisClient.del(sessionId);
}

module.exports = {
  create: createSession,
  get: getSession,
  destroy: destroySession,
};
