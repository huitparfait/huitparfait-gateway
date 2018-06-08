'use strict';

const config = require('../config/config');
const generateUuid = require('uuid').v4;
const sessionStore = require('./session-store');

const isProduction = config.get('NODE_ENV') === 'production';

const defaultCookieOptions = {
  ttl: 24 * 60 * 60 * 1000,
  isSecure: isProduction,
  isSameSite: 'Lax',
  path: '/',
  domain: null,
  encoding: 'none',
  clearInvalid: false,
  strictHeader: true,
  passThrough: false,
};

const csrfTokenCookieName = getCookieName('csrf', isProduction);
const csrfTokenCookieOptions = {
  ...defaultCookieOptions,
  // Accessible to JavaScript
  isHttpOnly: false,
};

const sessionIdCookieName = getCookieName('id', isProduction);
const sessionIdCookieOptions = {
  ...defaultCookieOptions,
  // Not accessible to JavaScript
  isHttpOnly: true,
};

function setSessionCookie (h, session) {
  const csrfToken = generateUuid();
  const sessionId = sessionStore.create({ ...session, csrfToken });
  h.state(csrfTokenCookieName, csrfToken, csrfTokenCookieOptions);
  h.state(sessionIdCookieName, sessionId, sessionIdCookieOptions);
}

function readSessionId (request) {
  const sessionId = request.state[sessionIdCookieName];
  return sessionId;
}

function destroyCookies (h) {
  h.unstate(csrfTokenCookieName, csrfTokenCookieOptions);
  h.unstate(sessionIdCookieName, sessionIdCookieOptions);
}

function getCookieName (name, enablePrefix) {
  return enablePrefix
    ? `__Host-${name}`
    : name;
}

module.exports = {
  setSessionCookie,
  readSessionId,
  destroyCookies,
};
